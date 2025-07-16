import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './navbar.css';

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const searchRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

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
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`); // Navigate to search results page
      setShowSearch(false); // Close the search bar
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="brand">Booking_Hall</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">About Us</a>
          <a href="#" className="nav-link">List Venue</a>
        </div>
        <div className="navbar-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Signup</button>
        </div>
      </div>
    </nav>
  );
}