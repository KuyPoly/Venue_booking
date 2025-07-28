import React, { useEffect, useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
  const [listingCount, setListingCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [stats, setStats] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const ownerId = user?.id;

    // Fetch listings count
    fetch(`http://localhost:5000/listing?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => {
        setListingCount(data.listings?.length || 0);
      })
      .catch(err => console.error('Error fetching listings:', err));

    // Fetch booking stats (total)
    fetch(`http://localhost:5000/booking/stats?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => {
        setStats(data.stats || []);
        const total = (data.stats || []).reduce((sum, s) => sum + parseInt(s.count), 0);
        setBookingCount(total);
      })
      .catch(err => console.error('Error fetching booking stats:', err));

    // Fetch booking requests
    fetch(`http://localhost:5000/booking/requests?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => setBookingRequests(data.requests || []))
      .catch(err => console.error('Error fetching booking requests:', err));

    // Fetch weekly earnings
    fetch(`http://localhost:5000/earnings/weekly?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => setWeeklyEarnings(data.earnings || []))
      .catch(err => console.error('Error fetching weekly earnings:', err));

    // Fetch payout history
    fetch(`http://localhost:5000/payouts/history?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => setPayouts(data.payouts || []))
      .catch(err => console.error('Error fetching payouts:', err));

    // Fetch recent activities
    fetch(`http://localhost:5000/activities?owner_id=${ownerId}`)
      .then(res => res.json())
      .then(data => setRecentActivities(data.activities || []))
      .catch(err => console.error('Error fetching activities:', err))
      .finally(() => setLoading(false));
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
        <div className="stat-card bookings">
          <div className="stat-icon"><i className="fas fa-calendar-plus"></i></div>
          <div className="stat-value">{bookingCount}</div>
          <div className="stat-title">Total Bookings</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '32px' }}>
        <div style={{ flex: 2 }}>
          {/* Recent Activities */}
          <div className="card">
            <div className="card-title">
              Recent Activities
              <button className="clear-btn" onClick={() => setRecentActivities([])}>Clear all</button>
            </div>
            {recentActivities.length > 0 ? (
              recentActivities.map(act => (
                <div key={act.id}>
                  {act.description} on {new Date(act.date).toLocaleString()}
                </div>
              ))
            ) : (
              <div>No recent activities.</div>
            )}
          </div>

          {/* Analytics (placeholder) */}
          <div className="analytics">
            <div className="card-title">Listings Analytics</div>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfc2d4', fontSize: '1.1rem' }}>
              (Analytics Chart Placeholder)
            </div>
          </div>
        </div>

        <div style={{ flex: 0.97, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Booking Requests Card */}
          <div className="card small">
            <div className="card-title">Booking Requests</div>
            {bookingRequests.length > 0 ? (
              <ul>
                {bookingRequests.slice(0, 3).map(req => (
                  <li key={req.id}>
                    {req.amount.toLocaleString('en-US',{style:'currency', currency:'USD'})} on {new Date(req.date).toLocaleDateString()} – {req.status}
                  </li>
                ))}
              </ul>
            ) : (
              <div>You don't have any booking requests yet.</div>
            )}
          </div>

          {/* Earnings Card */}
          <div className="card small">
            <div className="card-title">
              Earnings <span style={{ float: 'right', color: '#bfc2d4', fontSize: '0.95rem' }}>Last 4 Weeks</span>
            </div>
            {weeklyEarnings.length > 0 ? (
              <ul>
                {weeklyEarnings.map(w => (
                  <li key={w.week}>
                    Week {w.week}: {w.amount.toLocaleString('en-US',{style:'currency', currency:'USD'})}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No earnings data.</div>
            )}
          </div>

          {/* Payout History Card */}
          <div className="card small">
            <div className="card-title">Payout History</div>
            {payouts.length > 0 ? (
              <ul>
                {payouts.map(p => (
                  <li key={p.id}>
                    {p.amount.toLocaleString('en-US',{style:'currency', currency:'USD'})} on {new Date(p.date).toLocaleDateString()} – {p.status}
                  </li>
                ))}
              </ul>
            ) : (
              <div>You don't have any payout history yet.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
