// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();
  return (
    <nav className="sidebar">
      <div className="logo">WEBNAME</div>
      <div className="section-title">MAIN</div>
      <ul>
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/"><i className="fas fa-tachometer-alt"></i> Dashboard</Link>
        </li>
        <li className={location.pathname === '/booking' ? 'active' : ''}>
          <Link to="/booking.jsx"><i className="fas fa-calendar-check"></i> Bookings</Link>
        </li>
        <li className={location.pathname === '/message' ? 'active' : ''}>
          <Link to="/message.jsx"><i className="fas fa-comment-dots"></i> Messages</Link>
        </li>
        <li className={location.pathname === '/wallet' ? 'active' : ''}>
        <Link to= "/wallet.jsx"><i className="fas fa-wallet"></i> Wallet</Link> /* TBA */
        </li>
        <li className={location.pathname === '/listing' ? 'active' : ''}>
        <Link to= "/listing.jsx"><i className="fas fa-home"></i> My Listings</Link> /* TBA */
        </li>
      </ul>
      <div className="section-title">ACCOUNT</div>
      <ul>
        <li className={location.pathname === '/profile' ? 'active' : ''}>
        <Link to= "/profile.jsx"><i className="fas fa-user"></i> My Profile</Link> /* TBA */
        </li>
        <li className={location.pathname === '/setting' ? 'active' : ''}>
        <Link to= "/setting.jsx"><i className="fas fa-cog"></i> Settings</Link> /* TBA */
        </li>
        <li><i className="fas fa-sign-out-alt"></i> Log Out </li>
      </ul>
    </nav>
  );
}
