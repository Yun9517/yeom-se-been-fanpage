import React from 'react';
import { Card, Col } from 'react-bootstrap';
import './PhotoItem.css';

function PhotoItem({ photo, index, onClick }) {
  return (
    <Col md={4} className="mb-4">
      <Card className="h-100 photo-card" onClick={() => onClick(index)}>
        <Card.Img variant="top" src={photo.src} className="photo-card-img" />
        <Card.Body>
          <Card.Title className="text-center">{photo.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default React.memo(PhotoItem);
