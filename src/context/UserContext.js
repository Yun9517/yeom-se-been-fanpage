import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, writeBatch, serverTimestamp, collection, query, where, getDocs, increment, addDoc, setDoc } from 'firebase/firestore';
import { achievementsList } from '../data/achievements';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, authLoading] = useAuthState(auth);
  const [points, setPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState({});
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const [loginNotification, setLoginNotification] = useState(null); // Removed

  // const clearLoginNotification = useCallback(() => { // Removed
  //   setLoginNotification(null);
  // }, []);

  const addNotification = useCallback(async (userId, source, title, message, link = null) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, 'notifications'), {
        userId,
        source,
        title,
        message,
        timestamp: serverTimestamp(),
        read: false,
        link,
      });
    } catch (e) {
      console.error("Error adding notification:", e);
    }
  }, []);

  const checkLoginAchievements = useCallback(async (currentAchievements) => {
    if (!user || user.isAnonymous) return false;

    const userDocRef = doc(db, 'userAchievements', user.uid);
    let madeChanges = false;

    const grantLoginAchievement = async (achievementId) => {
      const achievement = achievementsList.find(a => a.id === achievementId);
      if (!achievement || currentAchievements[achievementId]) return;

      const pointsGained = require('../data/achievements').pointRules.oneTime[achievement.tier] || 0;
      
      await setDoc(userDocRef, {
          [achievementId]: true,
          [`${achievementId}Date`]: serverTimestamp(),
          points: increment(pointsGained)
      }, { merge: true });
      madeChanges = true;

      // Add specific notification for login achievements
      await addNotification(user.uid, 'achievement', '成就解鎖！', `恭喜！您解鎖了「${achievement.name}」成就，獲得 ${pointsGained} 點！`, '/achievements');
    };

    const loginDaysCount = currentAchievements.loginDaysCount || 0;

    if (loginDaysCount >= 1) await grantLoginAchievement('firstLogin');
    if (loginDaysCount >= 3) await grantLoginAchievement('threeDayLogin');
    if (loginDaysCount >= 7) await grantLoginAchievement('sevenDayLogin');
    if (loginDaysCount >= 30) await grantLoginAchievement('thirtyDayLogin');
    
    return madeChanges;
  }, [user, addNotification]);

  const fetchUserData = useCallback(async () => {
    if (!user || user.isAnonymous) {
      setPoints(0);
      setUserAchievements({});
      setRedemptionHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const userDocRef = doc(db, 'userAchievements', user.uid);
      let userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // --- Existing User Logic ---
        const data = userDocSnap.data();

        // Daily login check
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastLoginDate = data.lastLoginDate?.toDate();
        
        if (!lastLoginDate || lastLoginDate.setHours(0, 0, 0, 0) < today.getTime()) {
          let pointsToAdd = 1; // Base daily point
          const unlockedTiers = new Set(
            achievementsList
              .filter(ach => data[ach.id])
              .map(ach => ach.tier)
          );
          if (unlockedTiers.has('DIAMOND')) pointsToAdd += require('../data/achievements').pointRules.dailyBonus.DIAMOND;
          if (unlockedTiers.has('MASTER')) pointsToAdd += require('../data/achievements').pointRules.dailyBonus.MASTER;

          await writeBatch(db).update(userDocRef, {
            lastLoginDate: serverTimestamp(),
            loginDaysCount: increment(1),
            points: increment(pointsToAdd)
          }).commit();
          await addNotification(user.uid, 'daily_login', '每日登入獎勵', `您已獲得 ${pointsToAdd} 點每日登入獎勵！`);
          
          const updatedDocAfterDaily = await getDoc(userDocRef);
          const dataAfterDaily = updatedDocAfterDaily.data();
          
          const achievementsChanged = await checkLoginAchievements(dataAfterDaily);

          if (achievementsChanged) {
              userDocSnap = await getDoc(userDocRef);
          } else {
              userDocSnap = updatedDocAfterDaily;
          }
        }
      } else {
        // --- New User Initialization ---
        const batch = writeBatch(db);
        const initialData = {
          userName: user.displayName,
          userEmail: user.email,
          createdAt: serverTimestamp(),
          lastLoginDate: serverTimestamp(),
          loginDaysCount: 1,
          points: 1,
        };

        const achievementIdEarlySupporter = 'earlySupporter';
        const cutoffDate = new Date('2025-08-31');
        if (new Date() <= cutoffDate) {
          const achievement = achievementsList.find(a => a.id === achievementIdEarlySupporter);
          if (achievement) {
            initialData[achievementIdEarlySupporter] = true;
            initialData[`${achievementIdEarlySupporter}Date`] = serverTimestamp();
            const pointsGained = require('../data/achievements').pointRules.oneTime[achievement.tier] || 0;
            initialData.points += pointsGained;
          }
        }

        // Handle 'firstLogin' achievement for new users
        const firstLoginAchievement = achievementsList.find(a => a.id === 'firstLogin');
        if (firstLoginAchievement) {
          initialData.firstLogin = true;
          initialData.firstLoginDate = serverTimestamp();
          const firstLoginPoints = require('../data/achievements').pointRules.oneTime[firstLoginAchievement.tier] || 0;
          initialData.points += firstLoginPoints;
        }
        
        batch.set(userDocRef, initialData);
        await batch.commit();

        // Send individual notifications for new user initial points
        await addNotification(user.uid, 'daily_login', '每日登入獎勵', `您已獲得 1 點每日登入獎勵！`);

        const earlySupporterAchievement = achievementsList.find(a => a.id === 'earlySupporter');
        if (earlySupporterAchievement) {
          const earlySupporterPoints = require('../data/achievements').pointRules.oneTime[earlySupporterAchievement.tier] || 0;
          await addNotification(user.uid, 'achievement', '成就解鎖！', `恭喜！您解鎖了「${earlySupporterAchievement.name}」成就，獲得 ${earlySupporterPoints} 點！`, '/achievements');
        }

        if (firstLoginAchievement) {
          const firstLoginPoints = require('../data/achievements').pointRules.oneTime[firstLoginAchievement.tier] || 0;
          await addNotification(user.uid, 'achievement', '成就解鎖！', `恭喜！您解鎖了「${firstLoginAchievement.name}」成就，獲得 ${firstLoginPoints} 點！`, '/achievements');
        }

        await checkLoginAchievements(initialData);
        
        userDocSnap = await getDoc(userDocRef);
      }

      if(userDocSnap.exists()) {
        const finalData = userDocSnap.data();
        setPoints(finalData.points || 0);
        setUserAchievements(finalData);
      }

      const historyQuery = query(
        collection(db, 'redemptionHistory'),
        where('userId', '==', user.uid)
      );
      const historySnapshot = await getDocs(historyQuery);
      const historyData = historySnapshot.docs
        .map(d => d.data())
        .sort((a, b) => (b.redeemedAt?.toDate() || 0) - (a.redeemedAt?.toDate() || 0));
      setRedemptionHistory(historyData);

    } catch (e) {
      console.error("Error fetching user data:", e);
      setError('無法載入使用者資料，請稍後再試。');
    } finally {
      setLoading(false);
    }
  }, [user, checkLoginAchievements]);

  useEffect(() => {
    fetchUserData();
  }, [user, fetchUserData]);

  const redeemItem = useCallback(async (item) => {
    if (!user || points < item.cost || userAchievements[item.id]) {
      throw new Error('Cannot redeem item');
    }

    const batch = writeBatch(db);

    const userDocRef = doc(db, 'userAchievements', user.uid);
    batch.update(userDocRef, {
      points: increment(-item.cost),
      [item.id]: true,
      [`${item.id}Date`]: serverTimestamp(),
    });

    const historyDocRef = doc(collection(db, 'redemptionHistory'));
    batch.set(historyDocRef, {
      userId: user.uid,
      userName: user.displayName,
      itemId: item.id,
      itemName: item.name,
      pointsSpent: item.cost,
      redeemedAt: serverTimestamp(),
    });

    await batch.commit();

    await addNotification(user.uid, 'redemption', '兌換成功！', `您已成功兌換「${item.name}」，花費 ${item.cost} 點。`, '/store');

    await fetchUserData();

  }, [user, points, userAchievements, fetchUserData, addNotification]);

  const processQuizResults = useCallback(async (quizResults) => {
    if (!user || user.isAnonymous) return [];

    const { score, questions, userAnswers } = quizResults;
    const userDocRef = doc(db, 'userAchievements', user.uid);
    const unlockedAchievements = [];

    await addDoc(collection(db, "scores"), {
      userName: user.displayName,
      userId: user.uid,
      score: score,
      userAnswers: userAnswers,
      createdAt: serverTimestamp()
    });

    await setDoc(userDocRef, {
      totalQuizSessions: increment(1),
      totalQuizzesAnswered: increment(questions.length),
      totalCorrectAnswers: increment(score),
      totalIncorrectAnswers: increment(questions.length - score),
    }, { merge: true });

    const userAchievementsSnap = await getDoc(userDocRef);
    const currentAchievements = userAchievementsSnap.exists() ? userAchievementsSnap.data() : {};

    const grantAchievement = async (achievementId) => {
      const achievement = achievementsList.find(a => a.id === achievementId);
      if (!achievement || currentAchievements[achievementId]) return;

      const pointsGained = require('../data/achievements').pointRules.oneTime[achievement.tier] || 0;
      
      await setDoc(userDocRef, {
          [achievementId]: true,
          [`${achievementId}Date`]: serverTimestamp(),
          points: increment(pointsGained)
      }, { merge: true });

      unlockedAchievements.push({ name: achievement.name, points: pointsGained });
      await addNotification(user.uid, 'achievement', '成就解鎖！', `恭喜！您解鎖了「${achievement.name}」成就，獲得 ${pointsGained} 點！`, '/achievements');
    };

    if (score === questions.length) await grantAchievement('firstPerfectScore');
    if (score === 0) await grantAchievement('firstAllWrong');

    const updatedStatsSnap = await getDoc(userDocRef);
    const updatedStats = updatedStatsSnap.data();

    for (const ach of achievementsList) {
        if (ach.progressField && updatedStats[ach.progressField] >= ach.targetValue) {
            await grantAchievement(ach.id);
        }
    }

    if (unlockedAchievements.length > 0) {
      await fetchUserData();
    }

    return unlockedAchievements;

  }, [user, fetchUserData, addNotification]);
  
  const value = {
    user,
    points,
    userAchievements,
    redemptionHistory,
    loading,
    error,
    authLoading, // Add authLoading here
    redeemItem,
    processQuizResults,
    fetchUserData,
    addNotification,
    getHighestAchievementTier: () => {
        if (!user || user.isAnonymous || !userAchievements) return null;
        let highestTierInfo = null;
        let highestOrder = -1;
        for (const achievement of achievementsList) {
            if (userAchievements[achievement.id]) {
                const tierKey = achievement.tier;
                const tierData = require('../data/achievements').achievementTiers[tierKey];
                if (tierData && tierData.order > highestOrder) {
                    highestOrder = tierData.order;
                    highestTierInfo = { key: tierKey, ...tierData };
                }
            }
        }
        return highestTierInfo;
    }
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
