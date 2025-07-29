import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Container, Spinner, Alert, Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaAward, FaMedal, FaStar, FaTimesCircle } from 'react-icons/fa'; // Example icons
import './Achievements.css';

const Achievements = () => {
  const [user] = useAuthState(auth);
  const [achievements, setAchievements] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const allAchievements = [
    {
      id: 'firstPerfectScore',
      name: '完美開局',
      description: '首次作答全對！',
      icon: <FaAward size={50} color="gold" />,
      unlocked: false,
    },
    {
      id: 'firstAllWrong',
      name: '勇氣可嘉',
      description: '首次作答全錯！',
      icon: <FaTimesCircle size={50} color="gray" />,
      unlocked: false,
    },
    {
      id: 'firstLogin',
      name: '首次登入',
      description: '首次登入網站！',
      icon: <FaStar size={50} color="#FFD700" />,
      unlocked: false,
    },
    {
      id: 'threeDayLogin',
      name: '來三天囉',
      description: '連續登入三天！',
      icon: <FaMedal size={50} color="#C0C0C0" />,
      unlocked: false,
    },
    {
      id: 'sevenDayLogin',
      name: '阿彬鐵粉',
      description: '連續登入七天！',
      icon: <FaAward size={50} color="#FF4500" />,
      unlocked: false,
    },
    {
      id: 'thirtyDayLogin',
      name: '女王的忠實護衛',
      description: '連續登入三十天！',
      icon: <FaAward size={50} color="#8A2BE2" />,
      unlocked: false,
    },
    {
      id: 'hundredQuizzes',
      name: '刷題高手',
      description: '累積作答 100 題！',
      icon: <FaAward size={50} color="#00BFFF" />,
      unlocked: false,
    },
    {
      id: 'fiveHundredQuizzes',
      name: '刷題達人',
      description: '累積作答 500 題！',
      icon: <FaMedal size={50} color="#FFD700" />,
      unlocked: false,
    },
    {
      id: 'thousandQuizzes',
      name: '阿彬代言人',
      description: '累積作答 1000 題！',
      icon: <FaStar size={50} color="#FF4500" />,
      unlocked: false,
      hiddenDescription: true, // Mark as hidden description
    },
    // Add more achievements here
  ];

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) {
        setLoading(false);
        setError("請先登入以查看成就。");
        return;
      }

      try {
        const docRef = doc(db, "userAchievements", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAchievements(docSnap.data());
        } else {
          setAchievements({}); // No achievements yet
        }
      } catch (err) {
        console.error("Error fetching achievements:", err);
        setError("無法載入成就，請稍後再試。");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [user]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="light" />
        <p className="text-white-50 mt-2">載入成就中...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="info">請登入以查看您的成就。</Alert>
      </Container>
    );
  }

  if (user.isAnonymous) {
    return (
      <Container className="mt-5">
        <Alert variant="info">您目前以訪客模式登入。如需查看並儲存成就，請使用 Google 帳戶登入。</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 leaderboard-container">
      <h2>我的成就</h2>
      {allAchievements.length === 0 ? (
        <Alert variant="info">目前沒有可解鎖的成就。</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {allAchievements.map((achievement) => {
            const isUnlocked = achievements[achievement.id];
            const unlockDate = achievements[`${achievement.id}Date`]?.toDate().toLocaleDateString();
            const tooltipContent = (
              <Tooltip id={`tooltip-${achievement.id}`}>
                <strong>{achievement.name}</strong><br />
                {isUnlocked || !achievement.hiddenDescription ? achievement.description : '???'}<br />
                {isUnlocked ? `解鎖日期: ${unlockDate}` : '尚未解鎖'}
              </Tooltip>
            );

            return (
              <Col key={achievement.id} className="d-flex justify-content-center">
                <OverlayTrigger placement="top" overlay={tooltipContent}>
                  <Card className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}>
                    <Card.Body className="text-center">
                      <div className="achievement-icon">
                        {achievement.icon}
                      </div>
                      <Card.Title className="mt-2">{achievement.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default Achievements;
