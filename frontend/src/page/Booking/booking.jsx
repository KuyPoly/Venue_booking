import React, { useEffect, useState, useContext } from 'react';
import './booking.css';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

function Booking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const ownerId = user?.id;

  useEffect(() => {
    if (!user) return;
    api.getOwnerBookings()
      .then(res => res.json())
      .then(data => {
        setBookings(data.booking || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching booking:', err);
        setLoading(false);
      });
  }, [ownerId]);

  const handleBookingAction = async (bookingId, action) => {
    try {
      const response = await api.updateBookingStatus(bookingId, action);

      if (response.ok) {
        // Refresh bookings after action
        const updatedResponse = await api.getOwnerBookings();
        const updatedData = await updatedResponse.json();
        setBookings(updatedData.booking || []);
      } else {
        console.error(`Failed to ${action} booking`);
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
    }
  };

  if (loading) {
    return <div className="main-content">Loading bookings...</div>;
  }

  // Group bookings by status
  const grouped = {
    pending: [],
    confirmed: [],
    cancelled: [],
    completed: []
  };
  bookings.forEach(b => {
    if (grouped[b.status]) grouped[b.status].push(b);
  });

  return (
    <main className="main-content">
      <h1 className="booking-requests-title">Booking Requests</h1>
      <div className="booking-requests-list">

        {/* Pending */}
        <div className="booking-card">
          <div className="booking-card-header">
            Pending Booking
            <span className="booking-card-date">
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
          <div className="booking-card-body">
            {grouped.pending.length > 0 ? (
              grouped.pending.map(b => (
                <div key={b.bookingId} className="booking-item">
                  <div className="booking-info">
                    <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                    <div className="booking-details">
                      <small>Amount: ${b.totalAmount}</small>
                      <small>Date: {new Date(b.bookingDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <button 
                      className="btn-approve"
                      onClick={() => handleBookingAction(b.bookingId, 'approve')}
                    >
                      Approve
                    </button>
                    <button 
                      className="btn-reject"
                      onClick={() => handleBookingAction(b.bookingId, 'reject')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>You don't have any pending bookings.</div>
            )}
          </div>
        </div>

        {/* Confirmed */}
        <div className="booking-card">
          <div className="booking-card-header">
            Approved Booking
            <span className="booking-card-date">
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
          <div className="booking-card-body">
            {grouped.confirmed.length > 0 ? (
              grouped.confirmed.map(b => (
                <div key={b.bookingId} className="booking-item">
                  <div className="booking-info">
                    <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                    <div className="booking-details">
                      <small>Amount: ${b.totalAmount}</small>
                      <small>Date: {new Date(b.bookingDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="booking-actions">
                    <button 
                      className="btn-complete"
                      onClick={() => handleBookingAction(b.bookingId, 'complete')}
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div>You don't have any confirmed bookings.</div>
            )}
          </div>
        </div>

        {/* Cancelled */}
        <div className="booking-card">
          <div className="booking-card-header">
            Cancelled Booking
            <span className="booking-card-date">
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
          <div className="booking-card-body">
            {grouped.cancelled.length > 0 ? (
              grouped.cancelled.map(b => (
                <div key={b.bookingId} className="booking-item">
                  <div className="booking-info">
                    <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                    <div className="booking-details">
                      <small>Amount: ${b.totalAmount}</small>
                      <small>Date: {new Date(b.bookingDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>You don't have any cancelled bookings.</div>
            )}
          </div>
        </div>

        {/* Completed (Expired) */}
        <div className="booking-card">
          <div className="booking-card-header">
            Completed Booking
            <span className="booking-card-date">
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
          <div className="booking-card-body">
            {grouped.completed.length > 0 ? (
              grouped.completed.map(b => (
                <div key={b.bookingId} className="booking-item">
                  <div className="booking-info">
                    <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                    <div className="booking-details">
                      <small>Amount: ${b.totalAmount}</small>
                      <small>Date: {new Date(b.bookingDate).toLocaleDateString()}</small>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>You don't have any completed bookings.</div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default Booking;
