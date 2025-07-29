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
        try {
          const requestsRes = await api.getBookingRequests();
          if (requestsRes.ok) {
            const requestsData = await requestsRes.json();
            setBookingRequests(Array.isArray(requestsData.requests) ? requestsData.requests : []);
          }
        } catch (error) {
          console.error('Error fetching booking requests:', error);
          setBookingRequests([]);
        }

        // Fetch weekly earnings
        try {
          const earningsRes = await api.getWeeklyEarnings();
          if (earningsRes.ok) {
            const earningsData = await earningsRes.json();
            setWeeklyEarnings(Array.isArray(earningsData.earnings) ? earningsData.earnings : []);
          }
        } catch (error) {
          console.error('Error fetching weekly earnings:', error);
          setWeeklyEarnings([]);
        }

        // Fetch payout history
        try {
          const payoutsRes = await api.getPayoutHistory();
          if (payoutsRes.ok) {
            const payoutsData = await payoutsRes.json();
            setPayouts(Array.isArray(payoutsData.payouts) ? payoutsData.payouts : []);
          }
        } catch (error) {
          console.error('Error fetching payout history:', error);
          setPayouts([]);
        }

        // Fetch recent activities
        try {
          const activitiesRes = await api.getActivities();
          if (activitiesRes.ok) {
            const activitiesData = await activitiesRes.json();
            setRecentActivities(Array.isArray(activitiesData.activities) ? activitiesData.activities : []);
          }
        } catch (error) {
          console.error('Error fetching recent activities:', error);
          setRecentActivities([]);
        }

        // Fetch wallet info
        try {
          const walletRes = await api.getWalletInfo();
          if (walletRes.ok) {
            const walletData = await walletRes.json();
            setWalletInfo(walletData || { balance: 0 });
          }
        } catch (error) {
          console.error('Error fetching wallet info:', error);
          setWalletInfo({ balance: 0 });
        }

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
              recentActivities.map((act, index) => (
                <div key={act.id || index}>
                  {act.description || 'Activity'} on {act.date ? new Date(act.date).toLocaleString() : 'N/A'}
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
                  <li key={req.id || Math.random()}>
                    ${(req.amount || 0).toLocaleString('en-US')} on {req.date ? new Date(req.date).toLocaleDateString() : 'N/A'} – {req.status || 'pending'}
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
                {weeklyEarnings.map((w, index) => (
                  <li key={w.week || index}>
                    Week {w.week || index + 1}: ${(w.amount || 0).toLocaleString('en-US')}
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
                {payouts.map((p, index) => (
                  <li key={p.id || index}>
                    ${(p.amount || 0).toLocaleString('en-US')} on {p.date ? new Date(p.date).toLocaleDateString() : 'N/A'} – {p.status || 'pending'}
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
