import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaHeart, FaFileAlt, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './navbar.css';

export default function LoggedInNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close the search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const isSearchIcon = event.target.closest('.search-icon');
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
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

  // Handle logout
  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    closeMobileMenu();
    navigate('/');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  };

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
            <a href="/about" className="nav-link">About Us</a>
            <Link to="/venues" className="nav-link">Venue</Link>
            
            {/* Conditional rendering based on user role */}
            {user?.role === 'customer' ? (
              <Link to="/be-owner" className="nav-link">List Your Venue</Link>
            ) : user?.role === 'owner' ? (
              <Link to="/my-venue" className="nav-link">My Venues</Link>
            ) : (
              <Link to="/be-owner" className="nav-link">List Your Venue</Link>
            )}
          </div>
          
          <div className="navbar-icons">
            {/* Heart icon for favorites */}
            <Link to="/favorites" className="nav-icon" title="Favorites">
              <FaHeart />
            </Link>
            
            {/* Document icon for bookings - visible to both customers and owners */}
            {(user?.role === 'customer' || user?.role === 'owner') && (
              <Link to="/booking-history" className="nav-icon" title="My Bookings">
                <FaFileAlt />
              </Link>
            )}
            
            {/* User profile dropdown */}
            <div className="user-menu-container" ref={userMenuRef}>
              <button 
                className="user-avatar"
                onClick={() => setShowUserMenu(!showUserMenu)}
                title="User Menu"
              >
                {getUserInitials()}
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user?.firstName} {user?.lastName}</div>
                    <div className="user-email">{user?.email}</div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FaUser />
                    Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <FaCog />
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
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
          Venues
        </Link>
        
        {/* Conditional rendering for mobile menu too */}
        {user?.role === 'customer' ? (
          <Link to="/be-owner" className="nav-link" onClick={closeMobileMenu}>
            List Your Venue
          </Link>
        ) : user?.role === 'owner' ? (
          <Link to="/my-venue" className="nav-link" onClick={closeMobileMenu}>
            My Venues
          </Link>
        ) : (
          <Link to="/be-owner" className="nav-link" onClick={closeMobileMenu}>
            List Your Venue
          </Link>
        )}
        
        <Link to="/favorites" className="nav-link" onClick={closeMobileMenu}>
          Favorites
        </Link>
        
        {(user?.role === 'customer' || user?.role === 'owner') && (
          <Link to="/booking-history" className="nav-link" onClick={closeMobileMenu}>
            My Bookings
          </Link>
        )}
        
        {user?.role === 'owner' && (
          <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
            Dashboard
          </Link>
        )}
        
        <Link to="/profile" className="nav-link" onClick={closeMobileMenu}>
          Profile
        </Link>
        <button className="logout-btn-mobile" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
}