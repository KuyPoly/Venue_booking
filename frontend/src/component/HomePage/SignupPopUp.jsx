import React from 'react';
import './SignupPopUp.css';

export default function SignupPopUp({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="favorite-modal-overlay">
      <div className="favorite-modal">
        <p className="favorite-modal-message">Please sign up to continue.</p>
        <button className="favorite-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
} 