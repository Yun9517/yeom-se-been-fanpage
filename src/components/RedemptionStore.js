import React, { useState, useMemo } from 'react';
import { useUser } from '../context/UserContext'; // Import the useUser hook
import { Container, Alert, Card, Button, Row, Col, ListGroup, Spinner, Tabs, Tab } from 'react-bootstrap';
import { achievementsList, achievementTiers } from '../data/achievements';
import { FaCoins } from 'react-icons/fa';
import './Achievements.css'; // Reuse styles
import './RedemptionStore.css'; // Import store-specific styles

const RedemptionStore = () => {
  const {
    user,
    points,
    userAchievements,
    redemptionHistory,
    loading,
    error: contextError,
    redeemItem,
  } = useUser();

  const [redeeming, setRedeeming] = useState(null);
  const [key, setKey] = useState('store');
  const [localError, setLocalError] = useState('');

  const redeemableItems = useMemo(() => {
    return achievementsList.filter(a => a.redeemable).sort((a, b) => {
      const tierOrderA = achievementTiers[a.tier]?.order || 99;
      const tierOrderB = achievementTiers[b.tier]?.order || 99;
      return tierOrderA - tierOrderB;
    });
  }, []);

  const masterAchievement = useMemo(() => redeemableItems.find(item => item.isMaster), [redeemableItems]);
  const regularRedeemableItems = useMemo(() => redeemableItems.filter(item => !item.isMaster), [redeemableItems]);

  const allRegularItemsUnlocked = useMemo(() => {
    if (!user || user.isAnonymous) return false;
    return regularRedeemableItems.every(item => userAchievements[item.id]);
  }, [user, userAchievements, regularRedeemableItems]);

  const handleRedeem = async (item) => {
    if (!user || points < item.cost || userAchievements[item.id]) {
      return;
    }
    setRedeeming(item.id);
    setLocalError('');

    try {
      await redeemItem(item);
    } catch (e) {
      console.error("Error redeeming item: ", e);
      setLocalError('兌換失敗，請稍後再試。');
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) {
    return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  }

  if (!user || user.isAnonymous) {
    return <Container className="mt-5"><Alert variant="warning">請登入以使用點數商店。</Alert></Container>;
  }

  const error = localError || contextError;

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>點數商店</h2>
        <Alert variant="success" className="mb-0">
          <FaCoins className="me-2" /> 您目前擁有：<strong>{points}</strong> 點
        </Alert>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setLocalError('')}>{error}</Alert>}

      <Tabs
        id="redemption-store-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 redemption-tabs"
      >
        <Tab eventKey="store" title="兌換商店">
          <Row xs={2} md={3} lg={5} className="g-4">
            {regularRedeemableItems.map(item => {
              const isUnlocked = userAchievements[item.id];
              const canAfford = points >= item.cost;
              const tierInfo = achievementTiers[item.tier];
              return (
                <Col key={item.id}>
                  <Card className={`achievement-card redeem-card-override h-100 ${isUnlocked ? 'unlocked' : 'locked'} tier-${item.tier.toLowerCase()}`}>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.description}</Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>等級: {tierInfo.name}</span>
                          <span style={{ color: tierInfo.color, fontWeight: 'bold' }}>
                            <FaCoins className="me-1" /> {item.cost}
                          </span>
                        </div>
                        <Button
                          variant="primary"
                          className="w-100 btn-theme-gradient"
                          disabled={isUnlocked || !canAfford || redeeming === item.id}
                          onClick={() => handleRedeem(item)}
                        >
                          {redeeming === item.id ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> :
                          isUnlocked ? '已擁有' :
                          !canAfford ? '點數不足' : '兌換'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
            {/* Master Achievement Card */}
            {masterAchievement && (
              <Col>
                {allRegularItemsUnlocked ? (
                  // Revealed Master Card
                  <Card className={`achievement-card redeem-card-override h-100 ${userAchievements[masterAchievement.id] ? 'unlocked' : 'locked'} tier-${masterAchievement.tier.toLowerCase()}`}>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{masterAchievement.name}</Card.Title>
                      <Card.Text>{masterAchievement.description}</Card.Text>
                      <div className="mt-auto">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>等級: {achievementTiers[masterAchievement.tier].name}</span>
                          <span style={{ color: achievementTiers[masterAchievement.tier].color, fontWeight: 'bold' }}>
                            <FaCoins className="me-1" /> {masterAchievement.cost}
                          </span>
                        </div>
                        <Button
                          variant="primary"
                          className="w-100 btn-theme-gradient"
                          disabled={userAchievements[masterAchievement.id] || points < masterAchievement.cost || redeeming === masterAchievement.id}
                          onClick={() => handleRedeem(masterAchievement)}
                        >
                          {redeeming === masterAchievement.id ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> :
                          userAchievements[masterAchievement.id] ? '已擁有' :
                          points < masterAchievement.cost ? '點數不足' : '兌換'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  // Mystery Card
                  <Card className="achievement-card redeem-card-override h-100 locked tier-master-mystery">
                    <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                      <Card.Title className="mystery-title">???</Card.Title>
                      <Card.Text className="mystery-text">解鎖所有其他商店物品以揭曉</Card.Text>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            )}
          </Row>
        </Tab>
        <Tab eventKey="history" title="兌換紀錄">
          {redemptionHistory.length > 0 ? (
            <ListGroup>
              {redemptionHistory.map((record, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{record.itemName}</strong>
                    <small className="d-block text-muted">
                      {record.redeemedAt?.toDate().toLocaleString()}
                    </small>
                  </div>
                  <span className="text-danger">-{record.pointsSpent} 點</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">您目前沒有任何兌換紀錄。</Alert>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default RedemptionStore;
