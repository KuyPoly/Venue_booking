import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './BookingHistory.css';
import pancakes from '../../assets/image1.png'; // Placeholder

// Define your status order for sorting
const statusOrder = ['confirmed', 'cancelled', 'completed']; // Only show these statuses

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateSort, setDateSort] = useState('latest');
  const [statusSort, setStatusSort] = useState('none');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (!token) {
        setLoading(false);
        setError('You must be logged in to view your booking history.');
        return;
      }

      try {
        const response = await api.getBookingHistory();

        if (!response.ok) {
          throw new Error('Failed to fetch booking history');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [token]);

  // Filter bookings by status if a specific status is selected
  const filteredBookings =
    statusSort === 'none'
      ? bookings
      : bookings.filter((b) => b.status === statusSort);

  // Always sort by statusOrder, then by date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    // Status order sort
    const aStatusIdx = statusOrder.indexOf(a.status);
    const bStatusIdx = statusOrder.indexOf(b.status);
    if (aStatusIdx !== bStatusIdx) {
      return aStatusIdx - bStatusIdx;
    }
    // Date sort
    const aDate = new Date(a.booking_date);
    const bDate = new Date(b.booking_date);
    return dateSort === 'latest' ? bDate - aDate : aDate - bDate;
  });

  if (loading) {
    return <div className="booking-history-container">Loading...</div>;
  }

  if (error) {
    return <div className="booking-history-container">Error: {error}</div>;
  }

  return (
    <div className="booking-history-container">
      <h1>Booking History</h1>
      {/* Sorting Controls */}
      <div className="booking-sort-controls">
        <div>
          <label htmlFor="dateSort">Sort by Date: </label>
          <select
            id="dateSort"
            value={dateSort}
            onChange={e => setDateSort(e.target.value)}
            className="sort-dropdown"
          >
            <option value="latest">Latest to Oldest</option>
            <option value="oldest">Oldest to Latest</option>
          </select>
        </div>
        <div>
          <label htmlFor="statusSort">Filter by Status: </label>
          <select
            id="statusSort"
            value={statusSort}
            onChange={e => setStatusSort(e.target.value)}
            className="sort-dropdown"
          >
            <option value="none">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      {sortedBookings.length === 0 ? (
        <div className="no-bookings">
          <p>You have no bookings yet.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {sortedBookings.map((booking) => (
            <div key={booking.booking_id} className="booking-card">
              <div className="booking-card-image">
                <img 
                  src={booking.hall_reservations?.[0]?.hall?.images?.[0]?.url || pancakes} 
                  alt={booking.hall_reservations?.[0]?.hall?.name} 
                />
                <div className="image-overlay">
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/booking/${booking.booking_id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
              <div className="booking-card-info">
                <h3>{booking.hall_reservations?.[0]?.hall?.name || 'Venue Name'}</h3>
                <p>Date: {new Date(booking.booking_date).toLocaleDateString()}</p>
                <p>Status: <span className={`status-${booking.status}`}>{booking.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;