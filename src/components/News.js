import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { db } from '../firebase'; // Import Firestore instance
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import NewsItem from './NewsItem';

import LoadingSpinner from './LoadingSpinner';

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsCollection = collection(db, 'news');
        const q = query(newsCollection, orderBy('date', 'desc')); // Order by date descending
        const newsSnapshot = await getDocs(q);
        const newsList = newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewsData(newsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news from Firestore:", err);
        setError('無法載入最新消息，請稍後再試。');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const visibleNews = isExpanded ? newsData : newsData.slice(0, 3);

  return (
    <section className="about-section section-2022 py-5">
      <Container>
        {/* Manual News Section */}
        <div className="mb-5">
          <h2 className="text-white">站內消息</h2>
          <div className="news-list">
            {loading && <LoadingSpinner loading={loading} />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && visibleNews.map(item => (
              <NewsItem
                key={item.id}
                date={item.date}
                title={item.title}
                content={item.content}
              />
            ))}
          </div>
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