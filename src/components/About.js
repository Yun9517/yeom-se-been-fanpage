import React from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

const About = () => {
  return (
    <div className="about-sections">
      {/* 2022 新人時期 */}
      <section className="about-section section-2022 py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} data-aos="fade-right">
              <Image src={`${process.env.PUBLIC_URL}/yeomsebeen_2022_volleyball_02.jpg`} fluid rounded />
            </Col>
            <Col md={6} data-aos="fade-left">
              <h2 className="text-white">2022 新人時期</h2>
              <p className="text-white">
                2022年12月3日正式以職業啦啦隊員出道的廉世彬，當時先參與職業男子排球 KEPCO Vixtorm Volleyball Team 以及職業女子籃球 Hana Bank Women's Basketball Team的應援工作，當時受到的關注度還不高
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2023-2024 起亞虎時期 */}
      <section className="about-section section-2023 py-5">
        <Container>
          <Row className="align-items-center flex-md-row-reverse">
            <Col md={6} data-aos="fade-left">
              <Image src={`${process.env.PUBLIC_URL}/yeomsebeen_2023_kia_01.jpg`} fluid rounded className="mb-3" />
              <Image src={`${process.env.PUBLIC_URL}/yeomsebeen_2023_kia_02.jpg`} fluid rounded />
            </Col>
            <Col md={6} data-aos="fade-right">
              <h2 className="text-white">2023-2024 起亞虎時期</h2>
              <p className="text-white">
                2023年正式加入起亞虎隊應援團，載起亞虎的這兩年，她也分別和邊荷律以及李珠珢成為隊友。2024年在韓國的網路論《Dctrend》上舉辦了一個職業啦啦隊人氣投票，而她最終以12,817票擊敗權熙媛、李珠珢以及李多慧拿下冠軍，也被封為2024年度職業啦啦隊女王，人氣也是在這時期快速上升。除了職業啦啦隊工作外，2024年11月12日廉世彬以藝名Snooze發表個人參與創作的單曲새벽감성，顯示出她多才多藝的面向。
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2025 現況，樂天桃猿與 NV 恐龍兩地應援時期 */}
      <section className="about-section section-2025 py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} data-aos="fade-right">
              <Image src={`${process.env.PUBLIC_URL}/yeomsebeen_2025_rakuten_01.jpg`} fluid rounded className="mb-3" />
              <Image src={`${process.env.PUBLIC_URL}/yeomsebeen_2025_rakuten_02.jpg`} fluid rounded className="mb-3" />
              <Image src={`${process.env.PUBLIC_URL}/yeomsebeen_2025_nc_01.jpg`} fluid rounded />
            </Col>
            <Col md={6} data-aos="fade-left">
              <h2 className="text-white">2025現況</h2>
              <p className="text-white">
                在季初宣布加入NC恐龍隊，隨後在2月26日宣布加入台灣樂天桃猿隊，IG粉絲也在今年突破10萬，個人相關周邊商品總是銷售一空。有歌手夢的她，在今年6月16日以Snooze藝名發行個人第二張單曲Cherry Blooming，且在桃園棒球場7月水蜜桃趴活動時撥放。在7月19日即將首次參加中華職棒明星賽，參與開幕表演，並且會在明星賽期間在球場內開快閃店「好厝邊 Hasubeen」攜手知名餐飲品牌「饗食天堂」聯名推出韓式料理，首度圓夢當店長，販賣韓國美食。啦啦隊女王廉世彬的故事還在繼續，帶給粉絲們驚喜
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;
