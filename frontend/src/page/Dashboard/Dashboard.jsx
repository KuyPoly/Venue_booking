import React from 'react';
import './dashboard.css';


const Dashboard = () => {
  return (
    <div>
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