import React, { useState } from 'react';
import './TransactionHistory.css';

const TransactionHistory = ({ transactions, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type, status) => {
    if (type === 'credit') return '💰';
    if (type === 'debit') {
      if (status === 'pending') return '⏳';
      if (status === 'completed') return '💸';
      if (status === 'failed') return '❌';
    }
    return '📊';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'earnings') return transaction.transaction_type === 'credit';
    if (filter === 'withdrawals') return transaction.transaction_type === 'debit';
    if (filter === 'pending') return transaction.status === 'pending';
    return true;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'amount') {
      return parseFloat(b.amount) - parseFloat(a.amount);
    }
    return 0;
  });

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <div className="header-title">
          <h3>📊 Transaction History</h3>
          <p>{transactions.length} total transactions</p>
        </div>
        <button className="refresh-btn" onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>

      <div className="transaction-controls">
        <div className="filter-controls">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="earnings">Earnings Only</option>
            <option value="withdrawals">Withdrawals Only</option>
            <option value="pending">Pending Only</option>
          </select>
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Date (Newest First)</option>
            <option value="amount">Amount (Highest First)</option>
          </select>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="no-transactions">
          <div className="no-transactions-icon">📭</div>
          <h4>No transactions found</h4>
          <p>
            {filter === 'all' 
              ? 'You haven\'t made any transactions yet'
              : `No ${filter} transactions found`
            }
          </p>
        </div>
      ) : (
        <div className="transaction-list">
          {sortedTransactions.map((transaction) => (
            <div key={transaction.transaction_id} className="transaction-item">
              <div className="transaction-icon">
                {getTransactionIcon(transaction.transaction_type, transaction.status)}
              </div>
              
              <div className="transaction-details">
                <div className="transaction-type">
                  {transaction.transaction_type === 'credit' 
                    ? (transaction.booking_id 
                        ? `Booking Payment #${transaction.booking_id}` 
                        : 'Booking Payment'
                      )
                    : 'Withdrawal'
                  }
                </div>
                
                <div className="transaction-description">
                  {transaction.description || 'No description'}
                </div>

                {transaction.transaction_type === 'debit' && transaction.bank_name && (
                  <div className="transaction-bank">
                    🏦 {transaction.bank_name}
                    {transaction.account_number && (
                      <span> • ****{transaction.account_number.slice(-4)}</span>
                    )}
                  </div>
                )}

                <div className="transaction-date">
                  {formatDate(transaction.created_at)}
                </div>
              </div>

              <div className="transaction-amount">
                <div className={`amount ${transaction.transaction_type}`}>
                  {transaction.transaction_type === 'credit' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </div>
                
                <div className={`status ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {sortedTransactions.length > 0 && (
        <div className="transaction-summary">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Earnings:</span>
              <span className="stat-value positive">
                {formatCurrency(
                  sortedTransactions
                    .filter(tx => tx.transaction_type === 'credit')
                    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                )}
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Total Withdrawals:</span>
              <span className="stat-value negative">
                {formatCurrency(
                  sortedTransactions
                    .filter(tx => tx.transaction_type === 'debit' && tx.status === 'completed')
                    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                )}
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Pending Withdrawals:</span>
              <span className="stat-value pending">
                {formatCurrency(
                  sortedTransactions
                    .filter(tx => tx.transaction_type === 'debit' && tx.status === 'pending')
                    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
