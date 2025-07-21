import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './BookingHistory.css';
import pancakes from '../../assets/image1.png'; // Placeholder

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const response = await fetch('http://localhost:5000/bookings/history', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

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

  if (loading) {
    return <div className="booking-history-container">Loading...</div>;
  }

  if (error) {
    return <div className="booking-history-container">Error: {error}</div>;
  }

  return (
    <div className="booking-history-container">
      <h1>Booking History</h1>
      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
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