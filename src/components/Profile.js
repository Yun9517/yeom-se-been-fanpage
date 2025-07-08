import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Profile = () => {
  return (
    <section className="about-section section-2025 py-5">
      <Container>
        <Row>
          <Col>
            <h1 className="text-white">個人檔案</h1>
          <h4 className="text-white-80 mb-3">基本資料</h4>
          <p className="text-white"><strong>姓名:</strong> 廉世彬 (염세빈, Yeom Se-Been)</p>
          <p className="text-white"><strong>出生:</strong> 2002年4月23日, 韓國首爾</p>
          <p className="text-white"><strong>學歷:</strong> 白石藝術大學 實用音樂系</p>
          <p className="text-white"><strong>出道日期:</strong> 2022年</p>
          
          <hr className="my-4" />

          <h4 className="text-white-80 mb-3">啦啦隊經歷</h4>
          <ul className="list-unstyled text-white">
            <li className="mb-2"><strong>2022:</strong> KEPCO Vixtorm Volleyball Team, Hana Bank Women's Basketball Team</li>
            <li className="mb-2"><strong>2023:</strong> 起亞虎, 高陽索諾天空槍手</li>
            <li className="mb-2"><strong>2024:</strong> 起亞虎, 安養正官庄赤紅火箭</li>
            <li className="mb-2"><strong>2025:</strong> 樂天桃猿, NC恐龍</li>
          </ul>

          <hr className="my-4" />

          <h4 className="text-white-80 mb-3">音樂作品</h4>
          <ul className="list-unstyled text-white">
            <li className="mb-2"><strong>2024:</strong> Snooze - 새벽감성</li>
            <li className="mb-2"><strong>2025:</strong> Snooze - Cherry Blooming</li>
          </ul>
        </Col>
      </Row>
    </Container>
    </section>
  );
};

export default Profile;
