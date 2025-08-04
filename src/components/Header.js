import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext'; // Import the useUser hook
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { FaGoogle, FaAward, FaCoins } from 'react-icons/fa';

const Header = () => {
  const { user, points, getHighestAchievementTier } = useUser(); // Use context

  const anonymousNicknames = [
    "阿彬鐵粉",
    "被阿彬拯救的粉絲",
    "女王阿彬的迷弟",
    "阿彬的頭號粉絲",
    "阿彬的忠實信徒"
  ];

  const getAnonymousDisplayName = () => {
    const randomIndex = Math.floor(Math.random() * anonymousNicknames.length);
    return anonymousNicknames[randomIndex];
  };

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

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error during anonymous login:', error);
    }
  };

  const highestTierInfo = getHighestAchievementTier();
  const dropdownBgColor = highestTierInfo ? highestTierInfo.color : null;

  let iconClassName = '';
  if (highestTierInfo && highestTierInfo.order >= 4) { // Platinum or higher
    iconClassName = `icon-glow tier-${highestTierInfo.key.toLowerCase()}`;
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <img
            src={process.env.PUBLIC_URL + '/yeomsebeen_about.jpg'}
            height="30"
            className="d-inline-block align-top"
            alt="Logo"
            style={{ marginRight: '8px', borderRadius: '5px' }}
          />
          廉世彬粉絲專頁
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/gallery">照片牆</Nav.Link>
            <Nav.Link as={NavLink} to="/videos">影音區</Nav.Link>
            <Nav.Link as={NavLink} to="/profile">生涯經歷</Nav.Link>
            <Nav.Link as={NavLink} to="/news">最新消息</Nav.Link>
            <Nav.Link as={NavLink} to="/quiz">粉絲小遊戲</Nav.Link>
            {user && !user.isAnonymous && (
              <Nav.Link as={NavLink} to="/messages">訊息中心</Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <span>
                    {user && !user.isAnonymous && (
                      <FaAward
                        size={24}
                        className={iconClassName}
                        style={{
                          color: dropdownBgColor || '#ccc',
                          marginRight: '8px',
                          verticalAlign: 'middle',
                          filter: highestTierInfo && highestTierInfo.key === 'DIAMOND' ? 'drop-shadow(0 0 5px rgba(0, 0, 150, 0.5))' : 
                                  highestTierInfo && highestTierInfo.key === 'MASTER' ? 'drop-shadow(0 0 5px rgba(174, 0, 174, 0.5))' : 
                                  'none'
                        }}
                      />
                    )}
                    <span style={{ verticalAlign: 'middle' }}>
                      {`歡迎, ${user.isAnonymous ? getAnonymousDisplayName() : user.displayName || '訪客'}`}
                    </span>
                  </span>
                }
                id="basic-nav-dropdown"
                menuVariant="dark"
              >
                <NavDropdown.Item disabled>
                  <FaCoins className="me-2" /> {points} 點
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/quiz-history">我的遊戲紀錄</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/achievements">我的成就</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/store">點數商店</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>登出</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown title="登入" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={handleGoogleLogin}>
                  <FaGoogle className="me-2" /> 使用 Google 登入
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleAnonymousLogin}>
                  匿名遊玩
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