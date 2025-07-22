import React, { useEffect, useState } from 'react';
import './booking.css';
import { useAuth } from './path/to/AuthContext';

function Booking() {
  const [booking, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const ownerId = user?.id;

  useEffect(() => {
    if (!ownerId) return;
    fetch(`http://localhost:5000/booking?owner_id=${ownerId}`)
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
                <div key={b.bookingId}>
                  <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                </div>
              ))
            ) : (
              <div>You don't have any bookings yet.</div>
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
                <div key={b.bookingId}>
                  <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                </div>
              ))
            ) : (
              <div>You don't have any bookings yet.</div>
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
                <div key={b.bookingId}>
                  <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                </div>
              ))
            ) : (
              <div>You don't have any bookings yet.</div>
            )}
          </div>
        </div>

        {/* Completed (Expired) */}
        <div className="booking-card">
          <div className="booking-card-header">
            Expired Booking
            <span className="booking-card-date">
              <i className="fas fa-chevron-down"></i>
            </span>
          </div>
          <div className="booking-card-body">
            {grouped.completed.length > 0 ? (
              grouped.completed.map(b => (
                <div key={b.bookingId}>
                  <strong>{b.customer?.name}</strong> — {b.halls.map(h => h.hallName).join(', ')}
                </div>
              ))
            ) : (
              <div>You don't have any bookings yet.</div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}

export default Booking;
