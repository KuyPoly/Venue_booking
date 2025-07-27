import React, { useState } from 'react';

const ABAPayModal = ({ show, onClose, amount, onAmountChange, onGenerateQR, loading, error, qr }) => {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', minWidth: '340px', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
        <h2 style={{ textAlign: 'center', marginBottom: 18 }}>ABA Pay QR Payment</h2>
        <div style={{ marginBottom: 16 }}>
          <label>Amount (USD):</label>
          <input type="number" min="1" value={amount} onChange={e => onAmountChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e0e0e0', marginTop: 6 }} />
        </div>
        <button onClick={onGenerateQR} disabled={loading || !amount} style={{ background: '#1a237e', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 18 }}>
          {loading ? 'Generating QR...' : 'Generate ABA QR'}
        </button>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {qr && (
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <img src={qr} alt="ABA QR Code" style={{ width: 200, height: 200, borderRadius: '12px', border: '1px solid #e0e0e0' }} />
            <div style={{ marginTop: 8, fontSize: 15, color: '#333' }}>Scan with ABA Mobile app</div>
          </div>
        )}
        <div style={{ marginTop: 18, fontSize: 14, color: '#666' }}>
          After payment, please upload your payment confirmation below (optional):
          <input type="file" accept="image/*" style={{ marginTop: 8 }} />
        </div>
      </div>
    </div>
  );
};

export default ABAPayModal;
