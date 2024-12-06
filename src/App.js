import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Logo from './components/common/Logo';
import Footer from './components/common/Footer';
import Login from './pages/common/Login';
import Signup from './pages/common/Signup';
import ForgotPassword from './pages/common/ForgotPassword';
import BuyerSellerChoice from './pages/common/BuyerSellerChoice';
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerProfile from './pages/buyer/BuyerProfile';
import SellerProfile from './pages/seller/SellerProfile';
import NavbarComponent from './components/common/NavbarComponent';
import BuyerHeader from './components/buyer/BuyerHeader';
import SellerHeader from './components/seller/SellerHeader';
import ProductDetail from './pages/buyer/ProductDetails';
import RequestProduct from './pages/buyer/RequestProduct';
import Verification from './pages/common/Verification';
import Notifications from './pages/common/Notifications';
import Wishlist from './pages/common/Wishlist';

import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect user if they haven't selected a role
  useEffect(() => {
    if (location.pathname !== "/signup" && location.pathname !== "/forgot-password" && location.pathname !== "/choose-role") {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      }
    }
  }, [location, navigate]);

  const isBuyerRoute = location.pathname.startsWith("/buyer-dashboard") || location.pathname === "/buyer-profile";
  const isSellerRoute = location.pathname.startsWith("/seller-dashboard") || location.pathname === "/seller-profile";
  const shouldShowNavbar =
    location.pathname === "/notifications" ||
    location.pathname === "/profile" ||
    location.pathname === "/wishlist" ||
    isBuyerRoute ||
    isSellerRoute ||
    location.pathname === "/request-product";

  // Logo click handler for redirecting to respective dashboard based on role
  const handleLogoClick = () => {
    const role = localStorage.getItem('userRole');
    if (role === 'seller') {
      navigate('/seller-dashboard');
    } else if (role === 'buyer') {
      navigate('/buyer-dashboard');
    }
  };

  // Ensure the logo is clickable only after the user has chosen a role
  const canClickLogo = localStorage.getItem('userRole');

  return (
    <>
      {/* Navbar for specific routes */}
      {shouldShowNavbar && <NavbarComponent />}

      {/* Buyer Header Layout (excluding profile and request product) */}
      {isBuyerRoute && location.pathname !== "/buyer-profile" && (
        <div className="d-flex">
          <BuyerHeader />
          <div className="flex-grow-1">{children}</div>
        </div>
      )}

      {/* Seller Header Layout */}
      {isSellerRoute && (
        <div className="d-flex">
          <SellerHeader />
          <div className="flex-grow-1">{children}</div>
        </div>
      )}

      {/* Default Layout without Header */}
      {!isBuyerRoute && !isSellerRoute && !shouldShowNavbar && (
        <>
          <Logo onLogoClick={canClickLogo ? handleLogoClick : null} />
          <div className="flex-grow-1">{children}</div>
        </>
      )}

      {/* Layout for routes with navbar but no header */}
      {shouldShowNavbar && !isBuyerRoute && !isSellerRoute && (
        <div className="flex-grow-1">{children}</div>
      )}

      {/* Layout for buyer profile without header */}
      {location.pathname === "/buyer-profile" && (
        <div className="flex-grow-1">{children}</div>
      )}
    </>
  );
};


function App() {
  return (
    <Router>
      <div className="app d-flex flex-column min-vh-100">
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/choose-role" element={<BuyerSellerChoice />} />
            <Route
              path="/"
              element={localStorage.getItem('token') ? <BuyerSellerChoice /> : <Login />}
            />
            <Route path="/verify" element={<Verification />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
            <Route path="/buyer-profile" element={<BuyerProfile />} />
            <Route path="/request-product" element={<RequestProduct />} />
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/seller-profile" element={<SellerProfile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<BuyerProfile />} />
          </Routes>
        </Layout>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

