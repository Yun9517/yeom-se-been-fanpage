import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const photos = [
  {
    src: `${process.env.PUBLIC_URL}/yeomsebin_field.jpg`,
    title: '球場應援',
  },
  {
    src: `${process.env.PUBLIC_URL}/yeomsebin_cuteface.jpg`,
    title: '可愛鬼臉',
  },
  {
    src: `${process.env.PUBLIC_URL}/yeomsebin_student.jpg`,
    title: '活動裝扮',
  },
];

const PhotoGallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = photos.map(photo => ({
    src: photo.src,
    title: photo.title,
  }));

  return (
    <Container id="gallery" className="my-5">
      <h2 className="text-center mb-4 text-white">照片牆</h2>
      <Row>
        {photos.map((photo, idx) => (
          <Col md={4} key={idx} className="mb-4">
            <Card className="h-100" onClick={() => { setIndex(idx); setOpen(true); }} style={{ cursor: 'pointer' }}>
              <Card.Img variant="top" src={photo.src} style={{ height: '300px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title className="text-center">{photo.title}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
      />
    </Container>
  );
};

export default PhotoGallery;