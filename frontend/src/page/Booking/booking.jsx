import React from 'react';
import './Booking.css';

function Booking() {
  return (
    <>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">WEBNAME</div>
        <div className="section-title">MAIN</div>
        <ul>
          <li onClick={() => window.location.href='Dashboard.html'}>
            <span className="icon"><i className="fas fa-tachometer-alt"></i></span>
            Dashboard
          </li>
          <li className="active" onClick={() => window.location.href='Booking.html'}>
            <span className="icon"><i className="fas fa-calendar-check"></i></span>
            Bookings
          </li>
          <li onClick={() => window.location.href='Message.html'}>
            <span className="icon"><i className="fas fa-comment-dots"></i></span>
            Messages
          </li>
          <li>
            <span className="icon"><i className="fas fa-wallet"></i></span>
            Wallet
          </li>
          <li>
            <span className="icon"><i className="fas fa-home"></i></span>
            My Listings
            <span style={{marginLeft: 'auto'}}><i className="fas fa-chevron-down"></i></span>
          </li>
        </ul>
        <div className="section-title">ACCOUNT</div>
        <ul>
          <li><span className="icon"><i className="fas fa-user"></i></span>My Profile</li>
          <li><span className="icon"><i className="fas fa-cog"></i></span>Setting</li>
          <li><span className="icon"><i className="fas fa-sign-out-alt"></i></span>Log Out</li>
        </ul>
      </nav>

      {/* Top Bar */}
      <header className="topbar">
        <div className="account">
          <i className="fas fa-user-circle"></i>
          My Account
          <select>
            <option></option>
          </select>
        </div>
        <div className="help">
          <i className="fas fa-question-circle"></i>
          Learn More
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="booking-requests-title">Booking Requests</h1>
        <div className="booking-requests-list">
          <div className="booking-card">
            <div className="booking-card-header">
              Pending Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
          <div className="booking-card">
            <div className="booking-card-header">
              Approved Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
          <div className="booking-card">
            <div className="booking-card-header">
              Cancelled Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
          <div className="booking-card">
            <div className="booking-card-header">
              Expired Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Booking;