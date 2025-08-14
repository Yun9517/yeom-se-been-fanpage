import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import LoadingSpinner from './LoadingSpinner';
import useFirestoreCollection from '../hooks/useFirestoreCollection';

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
  const videoQueryConstraints = useMemo(() => [
    // orderBy('date', 'desc') // 暫時移除此行，測試是否能載入資料
  ], []);

  const { data: videosData, loading, error } = useFirestoreCollection(
    'videos',
    videoQueryConstraints
  );

  return (
    <Container id="videos" className="mt-4 mb-5">
      <h2 className="text-center mb-4">影音區</h2>
      {loading && <LoadingSpinner loading={loading} />}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && videosData.length === 0 ? (
        <div className="text-center text-white-50">
          <p>目前沒有影片。</p>
        </div>
      ) : (
        <Row className="g-4">
          {videosData.map((video) => (
            <Col md={6} className="mb-4" key={video.id}>
              <VideoPlayer videoId={video.id} title={video.title} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default VideoGallery;