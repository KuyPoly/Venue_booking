import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './confirmation-overlay.css';

export default function ConfirmationOverlay({
  show,
  venue,
  date,
  guests,
  totalPrice,
  onBackHome
}) {
  if (!show) return null;
  return (
    <div className="confirmation-overlay">
      <div className="confirmation-card">
        <FaCheckCircle size={80} color="#17877B" className="confirmation-icon" />
        <h2 className="confirmation-title">Congratulations!</h2>
        <div className="confirmation-desc">You've successfully reserved in this venue</div>
        <div className="confirmation-details">
          <table className="confirmation-table">
            <tbody>
              <tr>
                <td className="confirmation-label">Venue</td>
                <td className="confirmation-value">{venue?.title || venue?.name || '-'}</td>
              </tr>
              <tr>
                <td className="confirmation-label">Date</td>
                <td className="confirmation-value">{date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : '-'}</td>
              </tr>
              <tr>
                <td className="confirmation-label">Guests</td>
                <td className="confirmation-value">{guests}</td>
              </tr>
              <tr>
                <td className="confirmation-label">Total Pay</td>
                <td className="confirmation-value">{totalPrice ? `$${totalPrice}` : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button
          className="confirmation-back-btn"
          onClick={onBackHome}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
