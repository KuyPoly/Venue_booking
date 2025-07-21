import React from 'react';
import './booking.css';


function Booking() {
  return (
    <>
      {/* Main Content */}
      <main className="main-content">
        <h1 className="booking-requests-title">Booking Requests</h1>
        <div className="booking-requests-list">
          <div className="booking-card">
            <div className="booking-card-header">
              Pending Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
          <div className="booking-card">
            <div className="booking-card-header">
              Approved Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
          <div className="booking-card">
            <div className="booking-card-header">
              Cancelled Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
          <div className="booking-card">
            <div className="booking-card-header">
              Expired Booking
              <span className="booking-card-date">
                July 7, 2025 - July 15, 2025 <i className="fas fa-chevron-down"></i>
              </span>
            </div>
            <div className="booking-card-body">
              You don't have any bookings yet.
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Booking;