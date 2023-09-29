import React, { useContext, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { store } from '../App';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import './index.css'; // Import the CSS file

function Header() {
  const [token, setToken] = useContext(store);
  const navigate = useNavigate();
  const location = useLocation();

  const decodeToken = (jwtToken) => {
    try {
      return jwtDecode(jwtToken);
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const storedToken = Cookies.get('jwtToken');

    if (storedToken) {
      const decodedToken = decodeToken(storedToken);

      if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
        setToken(storedToken);
      } else {
        Cookies.remove('jwtToken');
      }
    }
  }, [setToken]);

  const handleLogout = () => {
    Cookies.remove('jwtToken');
    localStorage.removeItem('jwtToken');
    setToken(null);
  };

  const userName = token ? decodeToken(token)?.user?.name : null;
  const firstLetter = userName ? userName.charAt(0).toUpperCase() : '';

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/signUp');
  };
  const profileBtn = () => {
    navigate('/myDashboard');
  };

  const showHeader = !(location.pathname === '/login' || location.pathname === '/signUp');

  return (
    <>
      {showHeader && (
        <Navbar collapseOnSelect expand="lg" bg="white" variant="light" className="navBar">
          <Container>
            <Navbar.Brand href="/">
              <img src="images/logo_2.png" alt="Logo" height="50" className="d-inline-block align-top" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <NavLink to="/hotel" className="nav-link" activeClassName="active">
                  Hotel
                </NavLink>
                <NavLink to="/flight" className="nav-link" activeClassName="active">
                  Flight
                </NavLink>
                <NavLink to="/about" className="nav-link" activeClassName="active">
                  About
                </NavLink>
                <NavLink to="/offers" className="nav-link" activeClassName="active">
                  Offers
                </NavLink>
              </Nav>
              <Nav>
              {token ? (
                <div className='d-flex flex-row '>
                  <Button className="me-5 loginBtn" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Button className="me-5 profileBtn" onClick={profileBtn}>
                    {firstLetter}
                  </Button>
                </div>
                
              ) : (
                <Nav>
                  <Button className="me-5 loginBtn" onClick={handleLoginClick}>
                    Login
                  </Button>
                  <Button className="signupBtn" onClick={handleSignUpClick}>
                    Sign Up
                  </Button>
                </Nav>
              )}
              
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      <hr className="hrLine" />
    </>
  );
}

export default Header;
