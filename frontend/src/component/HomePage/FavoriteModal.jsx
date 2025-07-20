import React from 'react';
import './FavoriteModal.css';

export default function FavoriteModal({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="favorite-modal-overlay">
      <div className="favorite-modal">
        <p className="favorite-modal-message">Please log in to add favorites.</p>
        <button className="favorite-modal-close" onClick={onClose}>Close</button>
      </div>
    </div>
  );
} 