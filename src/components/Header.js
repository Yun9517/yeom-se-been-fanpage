import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { FaGoogle } from 'react-icons/fa';

const Header = () => {
  const [user] = useAuthState(auth);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

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
          <Nav>
            {user ? (
              <NavDropdown title={`歡迎, ${user.displayName}`} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleLogout}>登出</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="登入" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleGoogleLogin}>
                  <FaGoogle className="me-2" /> 使用 Google 登入
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
