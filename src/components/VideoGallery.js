import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const VideoGallery = () => {
  return (
    <Container id="videos" className="my-5">
      <h2 className="text-center mb-4">影音區</h2>
      <Row>
        <Col md={6} className="mb-4">
          <div className="ratio ratio-16x9">
            <iframe 
              src="https://www.youtube.com/embed/gMb8xHtg-VA" 
              title="固定影片 1"
              allowFullScreen
            ></iframe>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="ratio ratio-16x9">
            <iframe 
              src="https://www.youtube.com/embed/0ViTu7kRdlM" 
              title="固定影片 2"
              allowFullScreen
            ></iframe>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="ratio ratio-16x9">
            <iframe 
              src="https://www.youtube.com/embed/YlSq4EGFrl0" 
              title="最新影片"
              allowFullScreen
            ></iframe>
          </div>
        </Col>
        <Col md={6} className="mb-4">
          <div className="ratio ratio-16x9">
            <iframe 
              src="https://www.youtube.com/embed/7xrOohoT6jg" 
              title="最熱門影片"
              allowFullScreen
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default VideoGallery;
