import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import ImageWithFallback from './ImageWithFallback'; // Import our custom component
import LoadingSpinner from './LoadingSpinner';
import useFirestoreDocument from '../hooks/useFirestoreDocument';
import './CareerJourney.css';
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css';

const CareerJourney = () => {
  const { data: pageContent, loading, error } = useFirestoreDocument('pages', 'careerJourney');



  useEffect(() => {
    AOS.refresh(); // Refresh AOS after component mounts
  }, []); // Empty dependency array to run once after initial render

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <LoadingSpinner loading={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!pageContent) {
    return (
      <Container className="mt-5">
        <Alert variant="info">找不到生涯旅程頁面的內容。</Alert>
      </Container>
    );
  } 

  return (
    <div className="profile-background">
      <Container className="my-4">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="profile-card">
              {/* --- 基本資料 --- */}
              <Card.Body className="text-center mb-4">
                <ImageWithFallback filename="yeomsebeen_about.jpg" roundedCircle width={150} height={150} className="profile-main-image" />
                <h1 className="text-white mt-3">廉世彬 (염세빈)</h1>
                <p className="text-white-50">Yeom Se-Been</p>
              </Card.Body>

              <div className="profile-section">
                <h3 className="section-title">{pageContent.bioTitle || '基本資料'}</h3>
                <p><strong>{pageContent.birthLabel || '出生:'}</strong> {pageContent.birthValue}</p>
                <p><strong>{pageContent.educationLabel || '學歷:'}</strong> {pageContent.educationValue}</p>
                <p><strong>{pageContent.debutLabel || '出道日期:'}</strong> {pageContent.debutValue}</p>
              </div>

              {/* --- 啦啦隊經歷 Timeline --- */}
              <div className="profile-section">
                <h3 className="section-title">啦啦隊經歷</h3>
                <div id="profile-timeline" className="mt-4">
                  <div className="timeline">
                    {pageContent.timeline && pageContent.timeline.map((item, index) => (
                      <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                        <div className="timeline-content">
                          <span className="timeline-year">{item.year}</span>
                          <p className="timeline-teams">{item.teams}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* --- 音樂作品 --- */}
              <div className="profile-section">
                <h3 className="section-title">音樂作品</h3>
                <ul className="list-unstyled music-list">
                  <li><strong>2024:</strong> <a href="https://www.youtube.com/watch?v=7xrOohoT6jg" target="_blank" rel="noopener noreferrer">Snooze - 새벽감성</a></li>
                  <li><strong>2025:</strong> <a href="https://www.youtube.com/watch?v=0ViTu7kRdlM" target="_blank" rel="noopener noreferrer">Snooze - Cherry Blooming</a></li>
                </ul>
              </div>

            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CareerJourney;