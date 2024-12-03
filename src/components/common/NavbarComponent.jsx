import React from 'react';
import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaBell, FaShoppingCart } from 'react-icons/fa';
import { RiUserHeartFill } from 'react-icons/ri';
import { BiSolidSelectMultiple } from 'react-icons/bi';
import './../../styles/style.css';
import logo from './../../assets/logo.png';

const NavbarComponent = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand href="/" className="font-weight-bold d-flex flex-column align-items-center">
          <img src={logo} alt="CampusMart Logo" className="navbar-brand-logo" />
        </Navbar.Brand>

        {/* Search Bar */}
        <Navbar.Toggle aria-controls="navbarSearchAndLinks" />
        <Navbar.Collapse id="navbarSearchAndLinks" className="justify-content-between">
          <Form className="d-flex mx-auto search-bar-container">
            <FormControl
              type="text"
              placeholder="Search products..."
              className="search-input"
            />
            <Button variant="light" className="search-button">
              🔍
            </Button>
          </Form>

          {/* Icons */}
          <Nav className="align-items-center">
            <Nav.Link onClick={() => navigate('/notifications')} className="d-flex flex-column align-items-center mx-2">
              <FaBell className="nav-link-icon" />
              <span className="nav-link-text">Notifications</span>
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/wishlist')} className="d-flex flex-column align-items-center mx-2">
              <FaHeart className="nav-link-icon" />
              <span className="nav-link-text">Wishlist</span>
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/profile')} className="d-flex flex-column align-items-center mx-2">
              <RiUserHeartFill className="nav-link-icon" />
              <span className="nav-link-text">Profile</span>
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/request-product')} className="d-flex flex-column align-items-center mx-2">
              <FaShoppingCart className="nav-link-icon" />
              <span className="nav-link-text">Request Product</span>
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/choose-role')} className="d-flex flex-column align-items-center mx-2">
              <BiSolidSelectMultiple className="nav-link-icon" />
              <span className="nav-link-text">Choose Role</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
