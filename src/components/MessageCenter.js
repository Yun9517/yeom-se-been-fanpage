import React, { useMemo, useState } from 'react';
import { Container, Alert, Spinner, ListGroup, Tab, Nav } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import useFirestoreCollection from '../hooks/useFirestoreCollection';
import { where, orderBy } from 'firebase/firestore';
import Pagination from './Pagination';
import './Achievements.css'; // Reuse styles
import './Pagination.css';

const MESSAGES_PER_PAGE = 15;

const MessageCenter = () => {
  const { user, loading: userLoading, error: userError } = useUser();
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const notificationsQueryConstraints = useMemo(() => {
    if (!user || user.isAnonymous) return [];

    const constraints = [where('userId', '==', user.uid)];
    if (activeTab !== 'all') {
      constraints.push(where('source', '==', activeTab));
    }
    constraints.push(orderBy('timestamp', 'desc'));
    return constraints;
  }, [user, activeTab]);

  const { data: notifications, loading: notificationsLoading, error: notificationsError } = useFirestoreCollection('notifications', notificationsQueryConstraints);

  // Pagination logic
  const indexOfLastMessage = currentPage * MESSAGES_PER_PAGE;
  const indexOfFirstMessage = indexOfLastMessage - MESSAGES_PER_PAGE;
  const currentMessages = notifications.slice(indexOfFirstMessage, indexOfLastMessage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const notificationSources = ['all', 'daily_login', 'achievement', 'redemption'];

  const sourceTranslations = {
    all: '全部',
    daily_login: '每日',
    achievement: '成就',
    redemption: '兌換'
  };

  if (userLoading || notificationsLoading) {
    return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
  }

  if (userError || notificationsError) {
    return <Container className="mt-5"><Alert variant="danger">無法載入訊息：{userError?.message || notificationsError?.message}</Alert></Container>;
  }

  if (!user || user.isAnonymous) {
    return <Container className="mt-5"><Alert variant="warning">請登入以查看您的訊息。</Alert></Container>;
  }

  return (
    <Container className="mt-5">
      <h2>訊息中心</h2>
      <Tab.Container id="message-center-tabs" activeKey={activeTab} onSelect={handleTabSelect}>
        <Nav variant="tabs" className="mb-3 redemption-tabs">
          {notificationSources.map(source => (
            <Nav.Item key={source}>
              <Nav.Link eventKey={source}>{sourceTranslations[source]}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        <Tab.Content>
          {notifications.length === 0 ? (
            <Alert variant="info">此分類中沒有任何訊息。</Alert>
          ) : (
            <>
              <ListGroup>
                {currentMessages.map((notification) => (
                  <ListGroup.Item key={notification.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{notification.title}</strong>
                      <small className="d-block text-muted">
                        {notification.message}
                      </small>
                      <small className="d-block text-muted">
                        {notification.timestamp?.toDate().toLocaleString()}
                      </small>
                    </div>
                    {/* Add read/unread status and mark as read button later */}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Pagination
                itemsPerPage={MESSAGES_PER_PAGE}
                totalItems={notifications.length}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default MessageCenter;
