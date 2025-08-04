import React, { useMemo } from 'react';
import { Container, Alert, Spinner, ListGroup } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import useFirestoreCollection from '../hooks/useFirestoreCollection';
import { where, orderBy } from 'firebase/firestore';

const MessageCenter = () => {
  const { user, loading: userLoading, error: userError } = useUser();

  const notificationsQueryConstraints = useMemo(() => {
    return user && !user.isAnonymous 
      ? [where('userId', '==', user.uid), orderBy('timestamp', 'desc')]
      : [];
  }, [user]);

  const { data: notifications, loading: notificationsLoading, error: notificationsError } = useFirestoreCollection('notifications', notificationsQueryConstraints);

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
      {notifications.length === 0 ? (
        <Alert variant="info">您目前沒有任何訊息。</Alert>
      ) : (
        <ListGroup>
          {notifications.map((notification) => (
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
      )}
    </Container>
  );
};

export default MessageCenter;
