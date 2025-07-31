import React from 'react';
import './WalletBalance.css';

const WalletBalance = ({ walletData, onWithdraw }) => {
  const balance = walletData?.balance ? parseFloat(walletData.balance) : 0;
  const ownerName = walletData?.owner ? 
    `${walletData.owner.first_name} ${walletData.owner.last_name}` : 
    'Owner';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getBalanceStatus = () => {
    if (balance >= 1000) return 'excellent';
    if (balance >= 500) return 'good';
    if (balance >= 100) return 'moderate';
    return 'low';
  };

  const getBalanceMessage = () => {
    if (balance >= 1000) return '🎉 Excellent balance!';
    if (balance >= 500) return '👍 Good balance';
    if (balance >= 100) return '💡 Consider withdrawing';
    if (balance > 0) return '💰 Some earnings available';
    return '📊 No earnings yet';
  };

  return (
    <div className="wallet-balance-card">
      <div className="balance-header">
        <div className="balance-title">
          <h2>Current Balance</h2>
          <p>Hello, {ownerName}</p>
        </div>
        <div className="balance-icon">
          💰
        </div>
      </div>

      <div className={`balance-amount ${getBalanceStatus()}`}>
        <span className="currency">$</span>
        <span className="amount">{balance.toFixed(2)}</span>
      </div>

      <div className="balance-status">
        <div className={`status-indicator ${getBalanceStatus()}`}></div>
        <span className="status-message">{getBalanceMessage()}</span>
      </div>

      <div className="balance-actions">
        <button 
          className="withdraw-btn"
          onClick={onWithdraw}
          disabled={balance < 10}
          title={balance < 10 ? 'Minimum withdrawal amount is $10' : 'Withdraw funds to your bank account'}
        >
          {balance < 10 ? '💸 Minimum $10 to withdraw' : '💸 Withdraw Funds'}
        </button>
      </div>

      {balance < 10 && balance > 0 && (
        <div className="balance-note">
          <small>💡 Minimum withdrawal amount is $10.00</small>
        </div>
      )}

      {balance === 0 && (
        <div className="balance-empty-state">
          <div className="empty-icon">📊</div>
          <h3>No earnings yet</h3>
          <p>Your earnings from venue bookings will appear here</p>
          <div className="empty-tips">
            <h4>Tips to earn more:</h4>
            <ul>
              <li>📸 Add high-quality photos to your venues</li>
              <li>📝 Write detailed descriptions</li>
              <li>⭐ Maintain good customer reviews</li>
              <li>💰 Set competitive pricing</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
