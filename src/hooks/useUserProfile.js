import { useState, useCallback } from 'react';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useUser } from '../context/UserContext';

export const useUserProfile = () => {
  const { user, userAchievements, fetchUserData } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const updateUserProfile = useCallback(async (newDisplayName) => {
    if (!user || user.isAnonymous) {
      const err = new Error("未登入或匿名用戶無法修改暱稱。");
      setError(err);
      throw err;
    }
    if (!newDisplayName || newDisplayName.trim() === '') {
      const err = new Error("暱稱不能為空。");
      setError(err);
      throw err;
    }

    setIsUpdating(true);
    setError(null);

    try {
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName.trim()
      });

      const userDocRef = doc(db, 'userAchievements', user.uid);
      await setDoc(userDocRef, { userName: newDisplayName.trim() }, { merge: true });

      await fetchUserData();

      setIsUpdating(false);
      return { success: true };
    } catch (e) {
      console.error("Error updating user profile:", e);
      const err = new Error("更新暱稱失敗，請稍後再試。");
      setError(err);
      setIsUpdating(false);
      throw err;
    }
  }, [user, fetchUserData]);

  const resetToInitialNickname = useCallback(async () => {
    if (!user || user.isAnonymous) {
      const err = new Error("未登入或匿名用戶無法重設暱稱。");
      setError(err);
      throw err;
    }
    if (!userAchievements || !userAchievements.initialDisplayName) {
      const err = new Error("無法取得初始暱稱。");
      setError(err);
      throw err;
    }

    // No need to set loading/error state here as it's handled by updateUserProfile
    try {
      await updateUserProfile(userAchievements.initialDisplayName);
      return { success: true };
    } catch (e) {
      // Error is already set by the updateUserProfile call
      console.error("Error resetting nickname:", e);
      throw new Error("重設暱稱失敗，請稍後再試。");
    }
  }, [user, userAchievements, updateUserProfile]);

  return {
    updateUserProfile,
    resetToInitialNickname,
    isUpdating,
    error,
    setError, // Expose setError to allow clearing it from the component
  };
};