/* filepath: d:\y2t3\venue_booking\frontend\src\component\nav\navbar.jsx */
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoggedInNavbar from './LoggedInNavbar';
import './navbar.css';

export default function Navbar({ openLoginModal, openSignupModal }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle login button click
  const handleLoginClick = (e) => {
    e.preventDefault();
    if (openLoginModal) {
      openLoginModal();
    }
    closeMobileMenu();
  };

  // Handle signup button click
  const handleSignupClick = (e) => {
    e.preventDefault();
    if (openSignupModal) {
      openSignupModal();
    }
    closeMobileMenu();
  };

  // Show loading state
  if (loading) {
    console.log('Navbar: Loading authentication state...');
    return (
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand">
            Booking_Hall
          </Link>
        </div>
        <div className="navbar-right">
          <div className="loading-spinner">Loading...</div>
        </div>
      </nav>
    );
  }

  // Show logged-in navbar
  if (isAuthenticated) {
    console.log('Navbar: User is authenticated, showing LoggedInNavbar');
    return <LoggedInNavbar />;
  }

  console.log('Navbar: User is not authenticated, showing login/signup navbar');
  // Show logged-out navbar
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand" onClick={closeMobileMenu}>
            OceanGate
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About us</Link> 
            <Link to="/venues" className="nav-link">Venue</Link>
            <Link to="/be-owner" className="nav-link">List Your Venue</Link>
            {/* No Favorites link for guests */}
          </div>
          <div className="navbar-buttons">
            <button type="button" className="login-btn" onClick={handleLoginClick}>Login</button>
            <button type="button" className="signup-bt" onClick={handleSignupClick}>Signup</button>
          </div>
        </div>

        {/* Hamburger Menu */}
        <div 
          className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" className="nav-link" onClick={closeMobileMenu}>
          Home
        </Link>
        <Link to="/about" className="nav-link" onClick={closeMobileMenu}>
          About
        </Link>
        <Link to="/venues" className="nav-link" onClick={closeMobileMenu}>
          List Venue
        </Link>
        <Link to="/be-owner" className="nav-link" onClick={closeMobileMenu}>
          List Your Venue
        </Link>
        {/* No Favorites link for guests */}
        <div className="navbar-buttons">
          <button type="button" className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
          <button type="button" className="signup-btn" onClick={handleSignupClick}>
            Signup
          </button>
        </div>
      </div>
    </>
  );
}
