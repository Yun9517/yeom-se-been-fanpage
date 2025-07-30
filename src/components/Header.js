import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaGoogle } from 'react-icons/fa';

import { achievementsList, achievementTiers } from '../data/achievements';

const Header = () => {
  const [user] = useAuthState(auth);
  const [userAchievements, setUserAchievements] = useState({});

  useEffect(() => {
    const fetchUserAchievements = async () => {
      if (user && !user.isAnonymous) {
        const userAchievementsRef = doc(db, "userAchievements", user.uid);
        const userAchievementsSnap = await getDoc(userAchievementsRef);
        if (userAchievementsSnap.exists()) {
          setUserAchievements(userAchievementsSnap.data());
        }
      }
    };
    fetchUserAchievements();
  }, [user]);

  const anonymousNicknames = [
    "阿彬鐵粉",
    "被阿彬拯救的粉絲",
    "女王阿彬的迷弟",
    "阿彬的頭號粉絲",
    "阿彬的忠實信徒"
  ];

  const getAnonymousDisplayName = () => {
    const randomIndex = Math.floor(Math.random() * anonymousNicknames.length);
    return anonymousNicknames[randomIndex];
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error during anonymous login:', error);
    }
  };

  useEffect(() => {
    const trackLoginDays = async () => {
      console.log("Header: trackLoginDays called. User:", user);
      if (user && !user.isAnonymous) {
        console.log("Header: User is authenticated and not anonymous. Checking login days.");
        const userAchievementsRef = doc(db, "userAchievements", user.uid);
        const userAchievementsSnap = await getDoc(userAchievementsRef);
        const userAchievementsData = userAchievementsSnap.exists() ? userAchievementsSnap.data() : {};

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to start of day

        const lastLoginDate = userAchievementsData.lastLoginDate?.toDate();
        let loginDaysCount = userAchievementsData.loginDaysCount || 0;

        console.log("Header: lastLoginDate from Firestore:", lastLoginDate, "loginDaysCount from Firestore:", loginDaysCount);

        if (!lastLoginDate || lastLoginDate.setHours(0, 0, 0, 0) < today.getTime()) {
          console.log("Header: Incrementing loginDaysCount for today.");
          loginDaysCount += 1;
          await setDoc(userAchievementsRef, {
            lastLoginDate: serverTimestamp(),
            loginDaysCount: loginDaysCount
          }, { merge: true });
          console.log("Header: Login days updated in Firestore. New count:", loginDaysCount);
        } else {
          console.log("Header: Already logged in today or lastLoginDate is future.");
        }
      } else {
        console.log("Header: User is null, anonymous, or not yet resolved.");
      }
    };

    trackLoginDays();
  }, [user]);

  const getHighestAchievementTierColor = () => {
    if (!user || user.isAnonymous || !userAchievements) return null; // No color for anonymous or no achievements

    let highestTier = null;
    let highestOrder = -1;

    for (const achievement of achievementsList) {
      if (userAchievements[achievement.id]) { // If achievement is unlocked
        const tier = achievementTiers[achievement.tier];
        if (tier && tier.order > highestOrder) {
          highestOrder = tier.order;
          highestTier = tier;
        }
      }
    }
    return highestTier ? highestTier.color : null;
  };

  const dropdownBgColor = getHighestAchievementTierColor();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">廉世彬粉絲專頁</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>首頁</Nav.Link>
            <Nav.Link as={NavLink} to="/gallery">照片牆</Nav.Link>
            <Nav.Link as={NavLink} to="/videos">影音區</Nav.Link>
            <Nav.Link as={NavLink} to="/profile">生涯經歷</Nav.Link>
            <Nav.Link as={NavLink} to="/news">最新消息</Nav.Link>
            <Nav.Link as={NavLink} to="/quiz">粉絲小遊戲</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown 
                title={`歡迎, ${user.isAnonymous ? getAnonymousDisplayName() : user.displayName || '訪客'}`} 
                id="basic-nav-dropdown"
                style={dropdownBgColor ? { border: `4px solid ${dropdownBgColor}`, borderRadius: '5px', padding: '0 10px' } : {}}
              >
                <NavDropdown.Item as={NavLink} to="/quiz-history">我的遊戲紀錄</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/achievements">我的成就</NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>登出</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="登入" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleGoogleLogin}>
                  <FaGoogle className="me-2" /> 使用 Google 登入
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleAnonymousLogin}>
                  匿名遊玩
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;