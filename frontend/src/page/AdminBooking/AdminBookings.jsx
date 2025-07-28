import React, { useEffect, useState } from 'react';
import axios from 'axios';


function getOwnerId() {
  // Try to get owner/admin user id from localStorage (adjust key if needed)
  return localStorage.getItem('user_id');
}

function AdminPendingBookings() {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(getOwnerId());

  useEffect(() => {
    // Fetch pending bookings
    if (!ownerId) return;
    axios.get(`/booking/pending?owner_id=${ownerId}`)
      .then(res => {
        setPendingBookings(res.data.booking || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [ownerId]);

  const handleApprove = async (bookingId) => {
    try {
      await axios.put(`/booking/${bookingId}`, { status: 'confirmed' });
      setPendingBookings(prev => prev.filter(b => b.bookingId !== bookingId));
    } catch (err) {
      alert('Failed to approve booking');
    }
  };

  if (!ownerId) return <div>Please log in as admin/owner.</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Pending Booking</h2>
      {pendingBookings.length === 0 ? (
        <div>You don't have any bookings yet.</div>
      ) : (
        <ul>
          {pendingBookings.map(booking => (
            <li key={booking.bookingId} style={{ marginBottom: '1em', border: '1px solid #ccc', padding: '1em' }}>
              <div>
                <strong>Customer:</strong> {booking.customer.name} ({booking.customer.email})
              </div>
              <div>
                <strong>Halls:</strong>
                <ul>
                  {booking.halls.map(hall => (
                    <li key={hall.hallId}>
                      {hall.hallName} ({hall.startDate} - {hall.endDate})
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Total Amount:</strong> ${booking.totalAmount}
              </div>
              <button onClick={() => handleApprove(booking.bookingId)}>Approve</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminPendingBookings;