import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './dashboard.css';

const Dashboard = () => {
  const [listingCount, setListingCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [weeklyEarnings, setWeeklyEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [walletInfo, setWalletInfo] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const ownerId = user?.id;

    const fetchDashboardData = async () => {
      try {
        // Fetch listings count
        const listingsRes = await api.getListings(ownerId);
        const listingsData = await listingsRes.json();
        setListingCount(listingsData.listings?.length || 0);

        // Fetch booking stats
        const statsRes = await api.getBookingStats();
        const statsData = await statsRes.json();
        const total = (statsData.stats || []).reduce((sum, s) => sum + parseInt(s.count), 0);
        setBookingCount(total);

        // Fetch booking requests
        const requestsRes = await api.getBookingRequests();
        const requestsData = await requestsRes.json();
        setBookingRequests(requestsData.requests || []);

        // Fetch weekly earnings
        const earningsRes = await api.getWeeklyEarnings();
        const earningsData = await earningsRes.json();
        setWeeklyEarnings(earningsData.earnings || []);

        // Fetch payout history
        const payoutsRes = await api.getPayoutHistory();
        const payoutsData = await payoutsRes.json();
        setPayouts(payoutsData.payouts || []);

        // Fetch recent activities
        const activitiesRes = await api.getActivities();
        const activitiesData = await activitiesRes.json();
        setRecentActivities(activitiesData.activities || []);

        // Fetch wallet info
        const walletRes = await api.getWalletInfo();
        const walletData = await walletRes.json();
        setWalletInfo(walletData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
        <div className="stat-card earnings">
          <div className="stat-icon"><i className="fas fa-wallet"></i></div>
          <div className="stat-value">${walletInfo.balance?.toFixed(2) || '0.00'}</div>
          <div className="stat-title">Available Balance</div>
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

          {/* Analytics Placeholder */}
          <div className="analytics">
            <div className="card-title">Listings Analytics</div>
            <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bfc2d4', fontSize: '1.1rem' }}>
              (Analytics Chart Placeholder)
            </div>
          </div>
        </div>

        <div style={{ flex: 0.97, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Booking Requests */}
          <div className="card small">
            <div className="card-title">Booking Requests</div>
            {bookingRequests.length > 0 ? (
              <ul>
                {bookingRequests.slice(0, 3).map(req => (
                  <li key={req.id}>
                    {req.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} on {new Date(req.date).toLocaleDateString()} – {req.status}
                  </li>
                ))}
              </ul>
            ) : (
              <div>You don't have any booking requests yet.</div>
            )}
          </div>

          {/* Earnings by Week */}
          <div className="card small">
            <div className="card-title">
              Earnings <span style={{ float: 'right', color: '#bfc2d4', fontSize: '0.95rem' }}>Last 4 Weeks</span>
            </div>
            {weeklyEarnings.length > 0 ? (
              <ul>
                {weeklyEarnings.map(w => (
                  <li key={w.week}>
                    Week {w.week}: {w.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </li>
                ))}
              </ul>
            ) : (
              <div>No earnings data.</div>
            )}
          </div>

          {/* Payout History */}
          <div className="card small">
            <div className="card-title">Payout History</div>
            {payouts.length > 0 ? (
              <ul>
                {payouts.map(p => (
                  <li key={p.id}>
                    {p.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} on {new Date(p.date).toLocaleDateString()} – {p.status}
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
