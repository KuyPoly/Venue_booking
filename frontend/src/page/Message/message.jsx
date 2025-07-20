import React from 'react';
import './Message.css';

function Messages() {
  const handleDashboardClick = () => {
    window.location.href = 'Dashboard.html';
  };

  const handleBookingClick = () => {
    window.location.href = 'Booking.html';
  };

  const handleMessageClick = () => {
    window.location.href = 'Message.html';
  };

  return (
    <>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">WEBNAME</div>
        <div className="section-title">MAIN</div>
        <ul>
          <li onClick={handleDashboardClick}>
            <span className="icon"><i className="fas fa-tachometer-alt"></i></span>
            Dashboard
          </li>
          <li onClick={handleBookingClick}>
            <span className="icon"><i className="fas fa-calendar-check"></i></span>
            Bookings
          </li>
          <li className="active" onClick={handleMessageClick}>
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
        <h1 className="messages-title">Messages</h1>
        <div className="messages-list">
          <div className="message-card">
            <div className="message-card-header">Inbox</div>
            <div className="message-card-body">You don't have any message yet.</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Messages;