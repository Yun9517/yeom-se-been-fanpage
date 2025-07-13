import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const News = () => {
  return (
    <section className="about-section section-2022 py-5">
      <Container>
        <Row>
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
