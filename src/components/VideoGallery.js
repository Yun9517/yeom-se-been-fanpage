import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const videosData = [
  { id: 'gMb8xHtg-VA', title: '固定影片 1' },
  { id: '0ViTu7kRdlM', title: '固定影片 2' },
  { id: 'uzDZwqO4lI8', title: '最新影片' },
  { id: '7xrOohoT6jg', title: '最熱門影片' },
];

const VideoPlayer = ({ videoId, title }) => {
  const [loaded, setLoaded] = useState(false);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="ratio ratio-16x9 video-thumbnail-container">
      {!loaded ? (
        <div className="video-thumbnail" onClick={() => setLoaded(true)}>
          <img src={thumbnailUrl} alt={title} className="img-fluid" />
          <div className="play-button"></div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

const VideoGallery = () => {
  return (
    <Container id="videos" className="my-5">
      <h2 className="text-center mb-4">影音區</h2>
      <Row>
        {videosData.map((video) => (
          <Col md={6} className="mb-4" key={video.id}>
            <VideoPlayer videoId={video.id} title={video.title} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default VideoGallery;
