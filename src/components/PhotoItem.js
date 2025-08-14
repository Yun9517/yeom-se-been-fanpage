import React from 'react';
import { Card, Col } from 'react-bootstrap';
import ImageWithFallback from './ImageWithFallback';

function PhotoItem({ photo, index, onClick }) {
  return (
    <Col md={4} className="mb-4">
      <Card className="h-100 shadow-sm" onClick={() => onClick(index)} style={{ cursor: 'pointer' }}>
        <Card.Img variant="top" src={`${process.env.PUBLIC_URL}/${photo.filename}`} alt={photo.title} style={{ height: '300px', objectFit: 'cover' }} />
        <Card.Body>
          <Card.Title className="text-center">{photo.title}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default React.memo(PhotoItem);