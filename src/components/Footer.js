import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center p-3 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-md-start mb-2 mb-md-0">
            <p className="mb-0">&copy; 2025 廉世彬粉絲專頁. All Rights Reserved.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="https://www.instagram.com/beena._s2/" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://www.youtube.com/@MyAsteroids2" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-youtube">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.94C18.88 4 12 4 12 4s-6.88 0-8.6.48a2.78 2.78 0 0 0-1.94 1.94C2 8.16 2 12 2 12s0 3.84.46 5.58a2.78 2.78 0 0 0 1.94 1.94C5.12 20 12 20 12 20s6.88 0 8.6-.48a2.78 2.78 0 0 0 1.94-1.94C22 15.84 22 12 22 12s0-3.84-.46-5.58z"></path>
                <polygon points="10 15 15 12 10 9 10 15"></polygon>
              </svg>
            </a>
            <a href="https://www.threads.com/@beena._s2" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
              <img src={`https://storage.googleapis.com/yeom-se-been-fanpage-assets/threads-white-icon.png`} alt="Threads" width="24" height="24" />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
