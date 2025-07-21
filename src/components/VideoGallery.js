import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

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
  const [videosData, setVideosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosCollection = collection(db, 'videos');
        const videosSnapshot = await getDocs(videosCollection);
        const videosList = videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVideosData(videosList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos from Firestore:", err);
        setError('無法載入影片，請稍後再試。');
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <Container id="videos" className="my-5">
      <h2 className="text-center mb-4">影音區</h2>
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="dark" />
          <p className="mt-2">載入中...</p>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {!loading && !error && (
        <Row>
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