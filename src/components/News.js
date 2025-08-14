import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { orderBy } from 'firebase/firestore';
import NewsItem from './NewsItem';
import LoadingSpinner from './LoadingSpinner';
import useFirestoreCollection from '../hooks/useFirestoreCollection';

const News = () => {
  const newsQueryConstraints = useMemo(() => [
    orderBy('date', 'desc')
  ], []);

  const { data: newsData, loading, error } = useFirestoreCollection(
    'news',
    newsQueryConstraints
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleNews = isExpanded ? newsData : newsData.slice(0, 3);

  return (
    <section className="about-section section-2022 py-5">
      <Container>
        {/* Manual News Section */}
        <div className="mb-5">
          <h2 className="text-white">站內消息</h2>
          {loading && <LoadingSpinner loading={loading} />}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && !error && newsData.length === 0 && (
            <div className="text-center text-white-50">
              <p>目前沒有最新消息。</p>
            </div>
          )}
          <Row className="g-4">
            {!loading && !error && newsData.length > 0 && visibleNews.map(item => (
              <Col key={item.id} md={6} lg={4}>
                <NewsItem
                  date={item.date}
                  title={item.title}
                  content={item.content}
                />
              </Col>
            ))}
          </Row>
          {newsData.length > 3 && !loading && !error && (
            <div className="text-center mt-4">
              <Button variant="outline-light" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? '收合舊消息' : '查看更多'}
              </Button>
            </div>
          )}
        </div>

        <hr style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }} />

        {/* Social Media Section */}
        <Row className="mt-5">
          <Col>
            <div className="my-4" style={{ overflow: 'hidden' }}>
              <h2 className="text-white">Threads 動態</h2>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                {/* Elfsight Social Feed */}
                <div dangerouslySetInnerHTML={{
                  __html: `
                    <div class="elfsight-app-84806fe0-be21-43f6-b389-27805bb9f9b0" data-elfsight-app-lazy></div>
                  `
                }} />
              </div>
            </div>

            <div className="my-4" style={{ overflow: 'hidden' }}>
              <h2 className="text-white">Instagram 動態</h2>
              {/* Elfsight Instagram Feed */}
              <div dangerouslySetInnerHTML={{
                __html: `
                  <div class="elfsight-app-f67c5a06-db6b-42cc-b17e-87e56c3dea9f" data-elfsight-app-lazy></div>
                `
              }} />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default News;