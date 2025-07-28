import React from 'react';
import './WalletStats.css';

const WalletStats = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const getGrowthPercentage = () => {
    if (!stats.totalEarnings || stats.totalEarnings === 0) return 0;
    return ((stats.thisMonthEarnings / stats.totalEarnings) * 100).toFixed(1);
  };

  const getWithdrawalRate = () => {
    if (!stats.totalEarnings || stats.totalEarnings === 0) return 0;
    return ((stats.totalWithdrawals / stats.totalEarnings) * 100).toFixed(1);
  };

  return (
    <div className="wallet-stats">
      <h3>📈 Wallet Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card earnings">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalEarnings)}</div>
            <div className="stat-label">Total Earnings</div>
            <div className="stat-subtitle">All time revenue</div>
          </div>
        </div>

        <div className="stat-card withdrawals">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.totalWithdrawals)}</div>
            <div className="stat-label">Total Withdrawn</div>
            <div className="stat-subtitle">{getWithdrawalRate()}% of earnings</div>
          </div>
        </div>

        <div className="stat-card monthly">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.thisMonthEarnings)}</div>
            <div className="stat-label">This Month</div>
            <div className="stat-subtitle">{getGrowthPercentage()}% of total</div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-value">{formatCurrency(stats.pendingWithdrawals)}</div>
            <div className="stat-label">Pending Withdrawals</div>
            <div className="stat-subtitle">Processing...</div>
          </div>
        </div>

        <div className="stat-card transactions">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.transactionCount}</div>
            <div className="stat-label">Total Transactions</div>
            <div className="stat-subtitle">All activity</div>
          </div>
        </div>

        <div className="stat-card net-earnings">
          <div className="stat-icon">💎</div>
          <div className="stat-content">
            <div className="stat-value">
              {formatCurrency(stats.totalEarnings - stats.totalWithdrawals)}
            </div>
            <div className="stat-label">Net Earnings</div>
            <div className="stat-subtitle">Available + Current balance</div>
          </div>
        </div>
      </div>

      <div className="stats-insights">
        <h4>💡 Insights</h4>
        <div className="insights-grid">
          {stats.thisMonthEarnings > 0 && (
            <div className="insight-item positive">
              <span className="insight-icon">📈</span>
              <span>You've earned {formatCurrency(stats.thisMonthEarnings)} this month!</span>
            </div>
          )}
          
          {stats.pendingWithdrawals > 0 && (
            <div className="insight-item warning">
              <span className="insight-icon">⏳</span>
              <span>You have {formatCurrency(stats.pendingWithdrawals)} in pending withdrawals</span>
            </div>
          )}
          
          {getWithdrawalRate() < 50 && stats.totalEarnings > 100 && (
            <div className="insight-item info">
              <span className="insight-icon">💰</span>
              <span>You've only withdrawn {getWithdrawalRate()}% of your earnings</span>
            </div>
          )}
          
          {stats.transactionCount >= 10 && (
            <div className="insight-item success">
              <span className="insight-icon">🎉</span>
              <span>Great! You have {stats.transactionCount} transactions</span>
            </div>
          )}
          
          {stats.totalEarnings === 0 && (
            <div className="insight-item neutral">
              <span className="insight-icon">🚀</span>
              <span>Start earning by getting more venue bookings!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletStats;
