import React, { useEffect } from 'react';
import { Container, Row, Col, OverlayTrigger, Tooltip, Alert, Card } from 'react-bootstrap';
import ImageWithFallback from './ImageWithFallback'; // Import our custom component
import LoadingSpinner from './LoadingSpinner';
import useFirestoreDocument from '../hooks/useFirestoreDocument';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  const { data: aboutContent, loading, error } = useFirestoreDocument('pages', 'about');

  useEffect(() => {
    if (!loading && aboutContent) {
      AOS.refresh();
    }
  }, [loading, aboutContent]);

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

  if (!aboutContent) {
    return (
      <Container className="mt-5">
        <Alert variant="info">找不到關於頁面的內容。</Alert>
      </Container>
    );
  }

  return (
    <div className="about-sections">
      {/* 2022 新人時期 */}
      <section className="about-section section-2022 py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} data-aos="fade-right">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-volleyball">
                    新人時期為排球應援的廉世彬，此時還略顯羞澀
                  </Tooltip>
                }
              >
                <ImageWithFallback filename="yeomsebeen_2022_volleyball_02.jpg" fluid rounded />
              </OverlayTrigger>
            </Col>
            <Col md={6} data-aos="fade-left">
              <Card className="bg-transparent border-0 text-white">
                <Card.Body>
                  <Card.Title as="h2" className="mb-4">{aboutContent.section2022Title}</Card.Title>
                  <Card.Text>
                    {aboutContent.section2022Content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2023-2024 起亞虎時期 */}
      <section className="about-section section-2023 py-5">
        <Container>
          <Row className="align-items-center flex-md-row-reverse">
            <Col md={6} data-aos="fade-left">
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-kia-01">
                    拯救世界的廉世彬，在起亞虎開始快速累積人氣，有如新一代啦啦隊女王降臨
                  </Tooltip>
                }
              >
                <ImageWithFallback filename="yeomsebeen_2023_kia_01.jpg" fluid rounded className="mb-3" />
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-kia-02">
                    多變的造型搭配招牌笑容，圈粉無數，粉絲快速累積
                  </Tooltip>
                }
              >
                <ImageWithFallback filename="yeomsebeen_2023_kia_02.jpg" fluid rounded />
              </OverlayTrigger>
            </Col>
            <Col md={6} data-aos="fade-right">
              <Card className="bg-transparent border-0 text-white">
                <Card.Body>
                  <Card.Title as="h2" className="mb-4">{aboutContent.section2023Title}</Card.Title>
                  <Card.Text>
                    {aboutContent.section2023Content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2025 現況，樂天桃猿與 NV 恐龍兩地應援時期 */}
      <section className="about-section section-2025 py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-rakuten-01">
                    重磅宣佈加盟樂天桃猿，台灣的球迷被拯救了
                  </Tooltip>
                }
              >
                <ImageWithFallback filename="yeomsebeen_2025_rakuten_01.jpg" fluid rounded className="mb-3" />
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-rakuten-02">
                    台灣夏季天氣炎熱，阿彬依舊賣力應援
                  </Tooltip>
                }
              >
                <ImageWithFallback filename="yeomsebeen_2025_rakuten_02.jpg" fluid rounded className="mb-3" />
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip id="tooltip-nc-01">
                    寵粉的阿彬沒有忘記韓國球迷，在NC恐龍也有應援，女王阿彬一直在拯救世界
                  </Tooltip>
                }
              >
                <ImageWithFallback filename="yeomsebeen_2025_nc_01.jpg" fluid rounded />
              </OverlayTrigger>
            </Col>
            <Col md={6}>
              <Card className="bg-transparent border-0 text-white">
                <Card.Body>
                  <Card.Title as="h2" className="mb-4">{aboutContent.section2025Title}</Card.Title>
                  <Card.Text>
                    {aboutContent.section2025Content}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;