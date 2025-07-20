import React from 'react';
import './dashboard.css';
import Booking from './booking.jsx'
import Message from './message.jsx'


const Dashboard = () => {
  return (
    <div>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="logo">WEBNAME</div>
        <div className="section-title">MAIN</div>
        <ul>
          <li className="active" onClick={() => window.location.href='Dashboard.html'}>
            <span className="icon"><i className="fas fa-tachometer-alt"></i></span>Dashboard
          </li>
          <li onClick={() => window.location.href='Booking.html'}>
            <span className="icon"><i className="fas fa-calendar-check"></i></span>Bookings
          </li>
          <li onClick={() => window.location.href='Message.html'}>
            <span className="icon"><i className="fas fa-comment-dots"></i></span>Messages
          </li>
          <li>
            <span className="icon"><i className="fas fa-wallet"></i></span>Wallet
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
        <h1>Hello, User !</h1>
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon"><i className="fas fa-map"></i></div>
            <div className="stat-value">0</div>
            <div className="stat-title">Active Listings</div>
          </div>
          <div className="stat-card views">
            <div className="stat-icon"><i className="fas fa-eye"></i></div>
            <div className="stat-value">0</div>
            <div className="stat-title">Total Views</div>
          </div>
          <div className="stat-card bookings">
            <div className="stat-icon"><i className="fas fa-calendar-plus"></i></div>
            <div className="stat-value">0</div>
            <div className="stat-title">Total Bookings</div>
          </div>
        </div>
        {/* Main Cards Row */}
        <div style={{display: 'flex', gap: '32px'}}>
          <div style={{flex: 2}}>
            {/* Recent Activities */}
            <div className="card">
              <div className="card-title">Recent Activities <button className="clear-btn">Clear all</button></div>
              <div>You don't have any activities logged yet.</div>
            </div>
            {/* Analytics */}
            <div className="analytics">
              <div className="card-title">Listings Analytics</div>
              {/* Placeholder for chart */}
              <div style={{height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfc2d4', fontSize: '1.1rem'}}>
                (Analytics Chart Placeholder)
              </div>
            </div>
            {/* Recent Messages */}
            <div className="card">
              <div className="card-title">Recent Messages <button className="clear-btn">Clear all</button></div>
              <div>You don't have any messages yet.</div>
            </div>
          </div>
          <div style={{flex: 0.97, display: 'flex', flexDirection: 'column', gap: '18px'}}>
            <div className="card small">
              <div className="card-title">Booking Request</div>
              <div>You don't have any booking yet.</div>
            </div>
            <div className="card small">
              <div className="card-title">Visitor Review</div>
              <div>You don't have any review yet.</div>
            </div>
            <div className="card small">
              <div className="card-title">Earnings <span style={{float: 'right', color: '#bfc2d4', fontSize: '0.95rem'}}>No data</span></div>
              <div>You don't have any earnings yet.</div>
            </div>
            <div className="card small">
              <div className="card-title">Payout History</div>
              <div>You don't have any payout yet.<br />You don't have any payout yet.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;