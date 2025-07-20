/* filepath: d:\y2t3\venue_booking\frontend\src\component\nav\navbar.jsx */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoggedInNavbar from './LoggedInNavbar';
import './navbar.css';

export default function Navbar({ openLoginModal, openSignupModal }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Close the search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const isSearchIcon = event.target.closest('.bi-search');
        if (!isSearchIcon) {
          setShowSearch(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowSearch(false);
    }
  };

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
    return <LoggedInNavbar />;
  }

  // Show logged-out navbar
  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand" onClick={closeMobileMenu}>
            Booking_Hall
          </Link>
        </div>

        <div className="navbar-right">
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <a href="#about" className="nav-link">About Us</a>
            <Link to="/venues" className="nav-link">Venue</Link>
            <Link to="/be-owner" className="nav-link">List Your Venue</Link>
            {/* No Favorites link for guests */}
          </div>
          <div className="navbar-buttons">
            <a href="#" className="login-btn" onClick={handleLoginClick}>Login</a>
            <a href="#" className="signup-btn" onClick={handleSignupClick}>Signup</a>
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
        <a href="#about" className="nav-link" onClick={closeMobileMenu}>
          About Us
        </a>
        <Link to="/venues" className="nav-link" onClick={closeMobileMenu}>
          List Venue
        </Link>
        <Link to="/be-owner" className="nav-link" onClick={closeMobileMenu}>
          List Your Venue
        </Link>
        {/* No Favorites link for guests */}
        <div className="navbar-buttons">
          <a href="#" className="login-btn" onClick={handleLoginClick}>
            Login
          </a>
          <a href="#" className="signup-btn" onClick={handleSignupClick}>
            Signup
          </a>
        </div>
      </div>
    </>
  );
}
