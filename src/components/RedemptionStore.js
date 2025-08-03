import React, { useState, useEffect, useMemo } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, writeBatch, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Container, Alert, Card, Button, Row, Col, ListGroup, Spinner, Tabs, Tab } from 'react-bootstrap';
import { achievementsList, achievementTiers } from '../data/achievements';
import { FaCoins } from 'react-icons/fa';
import './Achievements.css'; // Reuse styles
import './RedemptionStore.css'; // Import store-specific styles

const RedemptionStore = () => {
  const [user] = useAuthState(auth);
  const [points, setPoints] = useState(0);
  const [userAchievements, setUserAchievements] = useState({});
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redeeming, setRedeeming] = useState(null); // State to track which item is being redeemed
  const [key, setKey] = useState('store');

  const redeemableItems = useMemo(() => {
    return achievementsList.filter(a => a.redeemable).sort((a, b) => {
      const tierOrderA = achievementTiers[a.tier]?.order || 99;
      const tierOrderB = achievementTiers[b.tier]?.order || 99;
      return tierOrderA - tierOrderB;
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.isAnonymous) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(''); // Reset error on fetch
        // Fetch user data
        const userDocRef = doc(db, 'userAchievements', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setPoints(data.points || 0);
          setUserAchievements(data);
        }

        // Fetch redemption history
        const historyQuery = query(
          collection(db, 'redemptionHistory'),
          where('userId', '==', user.uid)
        );
        const historySnapshot = await getDocs(historyQuery);
        const historyData = historySnapshot.docs
          .map(d => d.data())
          .sort((a, b) => (b.redeemedAt?.toDate() || 0) - (a.redeemedAt?.toDate() || 0));
        setHistory(historyData);

      } catch (e) {
        console.error("Error fetching user data or history: ", e);
        setError('無法載入商店資料，請稍後再試。');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleRedeem = async (item) => {
    if (!user || points < item.cost || userAchievements[item.id]) {
      return;
    }
    setRedeeming(item.id);
    setError('');

    try {
      const batch = writeBatch(db);

      // 1. Update user's points and achievements
      const userDocRef = doc(db, 'userAchievements', user.uid);
      batch.update(userDocRef, {
        points: points - item.cost,
        [item.id]: true,
        [`${item.id}Date`]: serverTimestamp(),
      });

      // 2. Create redemption history record
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

      // Update state locally
      setPoints(prev => prev - item.cost);
      setUserAchievements(prev => ({ ...prev, [item.id]: true }));
      
      // Refetch history to show the new item
      const historyQuery = query(
        collection(db, 'redemptionHistory'),
        where('userId', '==', user.uid)
      );
      const historySnapshot = await getDocs(historyQuery);
      const historyData = historySnapshot.docs
        .map(d => d.data())
        .sort((a, b) => (b.redeemedAt?.toDate() || 0) - (a.redeemedAt?.toDate() || 0));
      setHistory(historyData);


    } catch (e) {
      console.error("Error redeeming item: ", e);
      setError('兌換失敗，請稍後再試。');
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

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h2>點數商店</h2>
        <Alert variant="success" className="mb-0">
          <FaCoins className="me-2" /> 您目前擁有：<strong>{points}</strong> 點
        </Alert>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <Tabs
        id="redemption-store-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3 redemption-tabs"
      >
        <Tab eventKey="store" title="兌換商店">
          <Row xs={2} md={3} lg={5} className="g-4">
            {redeemableItems.map(item => {
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
          </Row>
        </Tab>
        <Tab eventKey="history" title="兌換紀錄">
          {history.length > 0 ? (
            <ListGroup>
              {history.map((record, index) => (
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
