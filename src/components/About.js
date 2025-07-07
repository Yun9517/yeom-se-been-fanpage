import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

const About = () => {
  return (
    <Container id="home" className="my-5">
      <Row className="align-items-center">
        <Col md={4} className="text-center mb-4 mb-md-0">
          <Image src={`${process.env.PUBLIC_URL}/yeomsebin_about.jpg`} roundedCircle fluid className="profile-image" style={{ width: '300px', height: '300px', objectFit: 'cover', border: '5px solid #007bff' }} />
        </Col>
        <Col md={8}>
          <h2>關於 廉世彬 (Yeom Se-bin)</h2>
          <p>
            廉世彬（韓語：염세빈／廉世彬 Yeom Se-bin），出生於2002年4月23日，是韓國的啦啦隊員。她以其充滿活力的表演和迷人的個性而受到粉絲的喜愛。她曾效力於韓國職棒起亞虎和韓國排球聯賽水原韓國電力빅스톰，目前是中華職棒樂天桃猿啦啦隊「Rakuten Girls」的一員。
          </p>
          <Card bg="light" className="mt-3">
            <Card.Body>
              <Card.Text>
                <strong>姓名：</strong> 廉世彬 (Yeom Se-bin)<br/>
                <strong>生日：</strong> 2002年4月23日<br/>
                <strong>現屬隊伍：</strong> Rakuten Girls (樂天女孩)
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;