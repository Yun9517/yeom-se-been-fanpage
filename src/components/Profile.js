

import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import './Profile.css';

const Profile = () => {
    const cheerleadingExperience = [
    {
      year: '2022',
      teams: 'KEPCO Vixtorm Volleyball Team, Hana Bank Women\'s Basketball Team',
      image: 'https://storage.googleapis.com/yeom-se-been-fanpage-assets/yeomsebeen_2022_volleyball_02.jpg',
      fade: 'fade-right'
    },
    {
      year: '2023',
      teams: '起亞虎, 高陽索諾天空槍手',
      image: 'https://storage.googleapis.com/yeom-se-been-fanpage-assets/yeomsebeen_2023_kia_02.jpg',
      fade: 'fade-left'
    },
    {
      year: '2024',
      teams: '起亞虎, 安養正官庄赤紅火箭',
      image: 'https://storage.googleapis.com/yeom-se-been-fanpage-assets/yeomsebeen_2023_kia_03.jpg',
      fade: 'fade-right'
    },
    {
      year: '2025',
      teams: '樂天桃猿, NC恐龍',
      image: 'https://storage.googleapis.com/yeom-se-been-fanpage-assets/yeomsebeen_2025_nc_01.jpg',
      fade: 'fade-left'
    }
  ];

  return (
    <div className="profile-background">
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <div className="profile-card">
              {/* --- 基本資料 --- */}
              <div className="text-center mb-4">
                <Image src={`https://storage.googleapis.com/yeom-se-been-fanpage-assets/yeomsebeen_about.jpg`} roundedCircle width={150} height={150} className="profile-main-image" />
                <h1 className="text-white mt-3">廉世彬 (염세빈)</h1>
                <p className="text-white-50">Yeom Se-Been</p>
              </div>

              <div className="profile-section">
                <h3 className="section-title">基本資料</h3>
                <p><strong>出生:</strong> 2002年4月23日, 韓國首爾</p>
                <p><strong>學歷:</strong> 白石藝術大學 實用音樂系</p>
                <p><strong>出道日期:</strong> 2022年</p>
              </div>

              {/* --- 啦啦隊經歷 Timeline --- */}
              <div className="profile-section">
                <h3 className="section-title">啦啦隊經歷</h3>
                <div id="profile-timeline" className="mt-4">
                  <div className="timeline">
                    {cheerleadingExperience.map((item, index) => (
                      <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`} data-aos={item.fade}>
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

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
