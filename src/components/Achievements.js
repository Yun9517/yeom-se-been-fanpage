import React, { useState, useEffect, useMemo } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Container, Alert, Row, Col, Card, Dropdown, Modal } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import { FaQuestionCircle, FaAward } from 'react-icons/fa'; // For hidden achievements and general award icon
import './Achievements.css';

import { achievementsList, achievementTiers } from '../data/achievements';
import useFirestoreDocument from '../hooks/useFirestoreDocument';

const Achievements = () => {
  const [user, authLoading] = useAuthState(auth);
  const [sortOption, setSortOption] = useState('tier'); // 'tier' or 'date'
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentAchievementDetail, setCurrentAchievementDetail] = useState(null);

  // Fetch user achievements using the custom hook
  const { data: userAchievements, loading: userAchievementsLoading, error: userAchievementsError } = useFirestoreDocument(
    "userAchievements",
    user ? user.uid : null // Only fetch if user is available
  );

  // Combine loading and error states
  const loading = authLoading || userAchievementsLoading;
  const error = userAchievementsError;

  // Effect to reset achievements when user logs in/out
  useEffect(() => {
    if (!user) {
      // User logged out, clear achievements and reset states
      // userAchievements is already null/empty from useFirestoreDocument when user is null
      // setLoading(false); // Handled by useFirestoreDocument
      // setError("請先登入以查看成就。"); // Handled by useFirestoreDocument
    }
  }, [user]); // Only depends on user

  // Sort achievements by tier order and then by unlocked status
  const sortedAchievements = useMemo(() => {
    if (!userAchievements) return []; // Return empty array if no user achievements data

    return [...achievementsList].sort((a, b) => {
      // Primary sort: hidden achievements last
      if (a.hidden && !b.hidden) return 1;
      if (!a.hidden && b.hidden) return -1;

      // If hidden status is the same, apply existing sorting logic
      const isUnlockedA = userAchievements[a.id];
      const isUnlockedB = userAchievements[b.id];

      // Secondary sort: unlocked achievements first
      if (isUnlockedA && !isUnlockedB) return -1;
      if (!isUnlockedA && isUnlockedB) return 1;

      // Tertiary sort: based on user's sortOption
      if (sortOption === 'tier') {
        const tierOrderA = achievementTiers[a.tier]?.order || 99;
        const tierOrderB = achievementTiers[b.tier]?.order || 99;
        return tierOrderB - tierOrderA; // Descending order for tier (Platinum > Gold > Silver > Bronze)
      } else if (sortOption === 'date') {
        // Sort by unlock date (newest first)
        const dateA = isUnlockedA ? userAchievements[`${a.id}Date`]?.toDate() : null;
        const dateB = isUnlockedB ? userAchievements[`${b.id}Date`]?.toDate() : null;

        if (dateA && dateB) {
          return dateB.getTime() - dateA.getTime();
        } else if (dateA) {
          return -1; // A has date, B doesn't (B is locked or no date), A comes first
        } else if (dateB) {
          return 1; // B has date, A doesn't, B comes first
        } else {
          return 0; // Neither has date (both locked or no date), maintain original order
        }
      }
      return 0; // Default case, maintain original order
    });
  }, [userAchievements, sortOption]);

  if (loading) {
    console.log("Achievements: Loading user authentication status or achievements data...");
    return (
      <Container className="mt-5 text-center">
        <LoadingSpinner loading={true} />
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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>我的成就</h2>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            排序方式: {sortOption === 'tier' ? '依等級' : '依取得時間'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => setSortOption('tier')}>依等級</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption('date')}>依取得時間</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {sortedAchievements.length === 0 ? (
        <Alert variant="info">目前沒有可解鎖的成就。</Alert>
      ) : (
        <Row xs={2} sm={2} md={3} lg={4} className="g-4">
          {sortedAchievements.map((achievement) => {
            const isUnlocked = userAchievements && userAchievements[achievement.id];
            const unlockDate = userAchievements && userAchievements[`${achievement.id}Date`]?.toDate().toLocaleDateString();

            const currentProgress = achievement.progressField ? (userAchievements && (userAchievements[achievement.progressField] || 0)) : 0;

            const displayDescription = isUnlocked || !achievement.hidden ? achievement.description : '???';
            const displayName = isUnlocked || !achievement.hidden ? achievement.name : '???';

            const handleCardClick = () => {
              setCurrentAchievementDetail({
                ...achievement,
                isUnlocked,
                unlockDate,
                currentProgress,
                displayDescription,
                displayName,
              });
              setShowDetailModal(true);
            };

            return (
              <Col key={achievement.id} className="d-flex justify-content-center">
                  <Card 
                    className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} tier-${achievement.tier.toLowerCase()}`}
                    onClick={handleCardClick}
                    style={{ cursor: 'pointer' }} // Indicate it's clickable
                  >
                    <Card.Body className="text-center">
                      <div className="achievement-icon">
                        {isUnlocked ? (
                          <FaAward size={50} /> // You can customize icons based on tier or achievement type here
                        ) : (
                          <FaQuestionCircle size={50} color="#ccc" />
                        )}
                      </div>
                      <Card.Title className="mt-2">{displayName}</Card.Title>
                      {achievement.progressField && !isUnlocked && (
                        achievement.hidden ? (
                          <div className="achievement-progress">
                            你正在慢慢解鎖中
                          </div>
                        ) : (
                          <div className="achievement-progress">
                            {currentProgress}/{achievement.targetValue}
                          </div>
                        )
                      )}
                    </Card.Body>
                  </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Achievement Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{currentAchievementDetail?.displayName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white text-center">
          {currentAchievementDetail && (
            <>
              <div className="mb-3">
                {currentAchievementDetail.isUnlocked ? (
                  <FaAward
                    size={80}
                    color={achievementTiers[currentAchievementDetail.tier]?.color}
                    className={`icon-glow tier-${currentAchievementDetail.tier.toLowerCase()}`}
                  />
                ) : (
                  <FaQuestionCircle
                    size={80}
                    color="#ccc"
                    className="icon-glow tier-locked" // Add a class for locked achievements if you want a subtle glow
                  />
                )}
              </div>
              <p>{currentAchievementDetail.displayDescription}</p>
              <p><strong>等級:</strong> {achievementTiers[currentAchievementDetail.tier]?.name}</p>
              {currentAchievementDetail.isUnlocked ? (
                <p><strong>解鎖日期:</strong> {currentAchievementDetail.unlockDate}</p>
              ) : (
                <p>尚未解鎖</p>
              )}
              {currentAchievementDetail.progressField && !currentAchievementDetail.isUnlocked && (
                currentAchievementDetail.hidden ? (
                  <p>你正在慢慢解鎖中</p>
                ) : (
                  <p><strong>進度:</strong> {currentAchievementDetail.currentProgress}/{currentAchievementDetail.targetValue}</p>
                )
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-dark">
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Achievements;