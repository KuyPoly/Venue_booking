import React, { useEffect, useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
  const [listingCount, setListingCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const ownerId = user?.id;

    // Fetch listings
    fetch(`http://localhost:5000/listing?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => {
        setListingCount(data.listings?.length || 0);
      })
      .catch(err => console.error('Error fetching listings:', err));

    // Fetch booking stats
    fetch(`http://localhost:5000/booking/stats?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || []);
        // Sum total bookings from stats
        const total = (data.stats || []).reduce((sum, s) => sum + parseInt(s.count), 0);
        setBookingCount(total);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching booking stats:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <>
      <h1>Hello, User!</h1>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-map"></i></div>
          <div className="stat-value">{listingCount}</div>
          <div className="stat-title">Active Listings</div>
        </div>
        <div className="stat-card views">
          <div className="stat-icon"><i className="fas fa-eye"></i></div>
          <div className="stat-value">0</div>
          <div className="stat-title">Total Views</div>
        </div>
        <div className="stat-card bookings">
          <div className="stat-icon"><i className="fas fa-calendar-plus"></i></div>
          <div className="stat-value">{bookingCount}</div>
          <div className="stat-title">Total Bookings</div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{ flex: 2 }}>
          {/* Recent Activities */}
          <div className="card">
            <div className="card-title">
              Recent Activities <button className="clear-btn">Clear all</button>
            </div>
            <div>(You can add recent activity logic later)</div>
          </div>

          {/* Analytics */}
          <div className="analytics">
            <div className="card-title">Listings Analytics</div>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfc2d4', fontSize: '1.1rem' }}>
              (Analytics Chart Placeholder)
            </div>
          </div>
        </div>

        <div style={{ flex: 0.97, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="card small">
            <div className="card-title">Booking Request</div>
            <div>{bookingCount > 0 ? `${bookingCount} total bookings` : `You don't have any booking yet.`}</div>
          </div>
          <div className="card small">
            <div className="card-title">Visitor Review</div>
            <div>You don't have any review yet.</div>
          </div>
          <div className="card small">
            <div className="card-title">
              Earnings <span style={{ float: 'right', color: '#bfc2d4', fontSize: '0.95rem' }}>No data</span>
            </div>
            <div>You don't have any earnings yet.</div>
          </div>
          <div className="card small">
            <div className="card-title">Payout History</div>
            <div>You don't have any payout yet.</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
