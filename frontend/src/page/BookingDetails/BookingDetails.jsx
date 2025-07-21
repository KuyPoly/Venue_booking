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

  return (
    <div className="booking-details-container">
      <div className="booking-details-card">
        <div className="booking-details-image">
          <img 
            src={hall?.images?.[0]?.url || pancakes} 
            alt={hall?.name} 
          />
        </div>
        <div className="booking-details-info">
          <h1>{hall?.name || 'Venue Name'}</h1>
          <p><strong>Location:</strong> {hall?.location}</p>
          <p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
          <p><strong>Price:</strong> ${booking.total_amount}</p>
          <p><strong>Status:</strong> <span className={`status-${booking.status}`}>{booking.status}</span></p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails; 