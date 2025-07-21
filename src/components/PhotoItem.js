import React from 'react';
import { Card, Col } from 'react-bootstrap';
import ImageWithFallback from './ImageWithFallback'; // Import our custom component
import './PhotoItem.css';

function PhotoItem({ photo, index, onClick }) {
  return (
    <Col md={4} className="mb-4">
      <Card className="h-100 photo-card" onClick={() => onClick(index)}>
        <ImageWithFallback filename={photo.filename} variant="top" className="photo-card-img" />
        <Card.Body>
          <Card.Title className="text-center">{photo.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default React.memo(PhotoItem);