import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaBell, FaBoxOpen, FaSignOutAlt } from "react-icons/fa";
import { RiUserHeartFill } from "react-icons/ri";
import { BiSolidSelectMultiple } from "react-icons/bi";
import "./../../styles/style.css";
import logo from "./../../assets/logo.png";
import { logoutUser } from "./../../services/api";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const shouldHideSearchBar = [
    "/notifications",
    "/profile",
    "/wishlist",
    "/request-product",
  ].includes(location.pathname) || location.pathname.startsWith("/product");

  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      console.log(response.message);
      navigate("/login");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleLogoClick = () => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "buyer") {
      navigate("/buyer-dashboard");
    } else if (userRole === "seller") {
      navigate("/seller-dashboard");
    }
  };

  const isLogoClickable = !["/login", "/signup", "/choose-role"].includes(
    location.pathname
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container fluid>
        {/* Logo */}
        <Navbar.Brand
          onClick={isLogoClickable ? handleLogoClick : null}
          className="font-weight-bold d-flex flex-column align-items-center"
          style={{
            cursor: isLogoClickable ? "pointer" : "default",
          }}
        >
          <img src={logo} alt="CampusMart Logo" className="navbar-brand-logo" />
        </Navbar.Brand>

        {!shouldHideSearchBar && (
          <Navbar.Toggle aria-controls="navbarSearchAndLinks" />
        )}
        <Navbar.Collapse
          id="navbarSearchAndLinks"
          className="justify-content-between"
        >
          {!shouldHideSearchBar && (
           <Form className="d-flex mx-auto search-bar-container">
           <FormControl
             type="text"
             placeholder="Search products..."
             className="search-input"
           />
           {/* Removed the search icon */}
           <Button variant="light" className="search-button">
           </Button>
         </Form>
         
          )}

          <Nav className="ms-auto align-items-center">
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Profile")}
            >
              <Nav.Link
                onClick={() => navigate("/profile")}
                className="d-flex flex-column align-items-center mx-2 nav-icon-container"
              >
                <RiUserHeartFill className="nav-link-icon" />
              </Nav.Link>
            </OverlayTrigger>

            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Notifications")}
            >
              <Nav.Link
                onClick={() => navigate("/notifications")}
                className="d-flex flex-column align-items-center mx-2 nav-icon-container"
              >
                <FaBell className="nav-link-icon" />
              </Nav.Link>
            </OverlayTrigger>

            {
              localStorage.getItem("userRole") === 'buyer' && (
                <><OverlayTrigger
                  placement="bottom"
                  overlay={renderTooltip("Wishlist")}
                >
                  <Nav.Link
                    onClick={() => navigate("/wishlist")}
                    className="d-flex flex-column align-items-center mx-2 nav-icon-container"
                  >
                    <FaHeart className="nav-link-icon" />
                  </Nav.Link>
                </OverlayTrigger><OverlayTrigger
                  placement="bottom"
                  overlay={renderTooltip("Request Product")}
                >
                    <Nav.Link
                      onClick={() => navigate("/request-product")}
                      className="d-flex flex-column align-items-center mx-2 nav-icon-container"
                    >
                      <FaBoxOpen className="nav-link-icon" />
                    </Nav.Link>
                  </OverlayTrigger></>
              ) 
            }
            <OverlayTrigger
              placement="bottom"
              overlay={renderTooltip("Choose Role")}
            >
              <Nav.Link
                onClick={() => navigate("/choose-role")}
                className="d-flex flex-column align-items-center mx-2 nav-icon-container"
              >
                <BiSolidSelectMultiple className="nav-link-icon" />
              </Nav.Link>
            </OverlayTrigger>

            <OverlayTrigger placement="bottom" overlay={renderTooltip("Logout")}>
              <Nav.Link
                onClick={handleLogout}
                className="d-flex flex-column align-items-center mx-2 nav-icon-container"
              >
                <FaSignOutAlt className="nav-link-icon" />
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

