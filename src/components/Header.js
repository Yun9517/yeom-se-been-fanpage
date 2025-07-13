import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">廉世彬粉絲專頁</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>首頁</Nav.Link>
            <Nav.Link as={NavLink} to="/gallery">照片牆</Nav.Link>
            <Nav.Link as={NavLink} to="/videos">影音區</Nav.Link>
            <Nav.Link as={NavLink} to="/profile">個人檔案</Nav.Link>
            <Nav.Link as={NavLink} to="/news">最新消息</Nav.Link>
            <Nav.Link as={NavLink} to="/quiz">粉絲小遊戲</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
