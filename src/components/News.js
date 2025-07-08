import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const News = () => {
  return (
    <section className="about-section section-2022 py-5">
      <Container>
        <Row>
          <Col>
            <h1 className="text-white">最新消息</h1>
          
          <div className="my-4">
            <h2 className="text-white">Threads 動態</h2>
            {/* 
              這裡是預留給 Threads Widget 的區塊。
              您可以從 Threads 的官方開發者文件或第三方服務 (如 Elfsight) 獲取嵌入代碼，
              然後將其貼在此處。
            */}
            <p className="text-white-50">Threads 動態牆即將推出...</p>
          </div>

          <div className="my-4">
            <h2 className="text-white">Instagram 動態</h2>
            {/* 
              這裡是預留給 Instagram Widget 的區塊。
              您可以從 Instagram 的官方開發者文件或第三方服務 (如 Elfsight) 獲取嵌入代碼，
              然後將其貼在此處。
            */}
            <p className="text-white-50">Instagram 動態牆即將推出...</p>
          </div>

        </Col>
      </Row>
    </Container>
    </section>
  );
};

export default News;
