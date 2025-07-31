import React from 'react';
import './ABAPayModal.css';

const ABAPayModal = ({ show, onClose, amount, onAmountChange, onGenerateQR, loading, error, qr }) => {
  if (!show) return null;
  return (
    <div className="aba-pay-modal-overlay">
      <div className="aba-pay-modal">
        <button className="aba-pay-modal-close" onClick={onClose}>&times;</button>
        <h2 className="aba-pay-modal-title">ABA Pay QR Payment</h2>
        <div className="aba-pay-modal-amount">
          <label>Amount (USD):</label>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={e => onAmountChange(e.target.value)}
            className="aba-pay-modal-input"
          />
        </div>
        <button
          onClick={onGenerateQR}
          disabled={loading || !amount}
          className="aba-pay-modal-generate-btn"
        >
          {loading ? 'Generating QR...' : 'Generate ABA QR'}
        </button>
        {error && <div className="aba-pay-modal-error">{error}</div>}
        {qr && (
          <div className="aba-pay-modal-qr">
            <img src={qr} alt="ABA QR Code" />
            <div className="aba-pay-modal-qr-label">Scan with ABA Mobile app</div>
          </div>
        )}
        <div className="aba-pay-modal-upload">
          After payment, please upload your payment confirmation below (optional):
          <input type="file" accept="image/*" className="aba-pay-modal-upload-input" />
        </div>
      </div>
    </div>
  );
};

export default ABAPayModal;
