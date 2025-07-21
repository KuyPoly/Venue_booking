import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './BookingDetails.css';
import pancakes from '../../assets/image1.png'; // Placeholder

const BookingDetails = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!token) {
        setLoading(false);
        setError('You must be logged in to view booking details.');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id, token]);

  if (loading) {
    return <div className="booking-details-container">Loading...</div>;
  }

  if (error) {
    return <div className="booking-details-container">Error: {error}</div>;
  }

  if (!booking) {
    return <div className="booking-details-container">Booking not found.</div>;
  }

  const hall = booking.hall_reservations?.[0]?.hall;
  const payment = booking.payment;

  return (
    <div className="booking-details-container">
      <h1 className="page-title">Booking Confirmation</h1>
      <div className="booking-details-card">
        <div className="booking-details-image">
          <img 
            src={hall?.images?.[0]?.url || pancakes} 
            alt={hall?.name} 
          />
        </div>
        <div className="booking-details-content">
          <div className="venue-details">
            <h2>{hall?.name || 'Venue Name'}</h2>
            <p className="venue-location">{hall?.location}</p>
          </div>

          <hr className="divider" />

          <div className="booking-info">
            <h3>Booking Details</h3>
            <div className="info-grid">
              <p><strong>Booking ID:</strong></p><p>{booking.booking_id}</p>
              <p><strong>Booking Date:</strong></p><p>{new Date(booking.booking_date).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong></p><p>${booking.total_amount}</p>
              <p><strong>Booking Status:</strong></p><p><span className={`status-badge status-${booking.status}`}>{booking.status}</span></p>
            </div>
          </div>
          
          {payment && (
            <div className="payment-info">
              <h3>Payment Information</h3>
              <div className="info-grid">
                <p><strong>Payment Method:</strong></p><p>{payment.payment_method}</p>
                <p><strong>Payment Status:</strong></p><p><span className={`status-badge status-${payment.status}`}>{payment.status}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 