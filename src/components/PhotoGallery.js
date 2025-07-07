import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const photos = [
  {
    src: '/yeomsebin_field.jpg',
    title: '球場應援',
  },
  {
    src: '/yeomsebin_cuteface.jpg',
    title: '可愛鬼臉',
  },
  {
    src: '/yeomsebin_student.jpg',
    title: '活動裝扮',
  },
];

const PhotoGallery = () => {
  return (
    <Container id="gallery" className="my-5">
      <h2 className="text-center mb-4">照片牆</h2>
      <Row>
        {photos.map((photo, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src={photo.src} style={{ height: '300px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title className="text-center">{photo.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PhotoGallery;