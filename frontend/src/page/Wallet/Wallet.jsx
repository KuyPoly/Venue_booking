import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import walletService from '../../services/walletService';
import './wallet.css';

const Wallet = () => {
  const { isAuthenticated, user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Withdrawal form data
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    bankName: '',
    bankAccountNumber: '',
    accountHolderName: '',
    routingNumber: ''
  });

  useEffect(() => {
    console.log('Wallet useEffect triggered', { isAuthenticated, token: token ? 'present' : 'missing' });
    
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      console.warn('User not authenticated:', { isAuthenticated, hasToken: !!token });
      setError('Please log in to access your wallet');
      setLoading(false);
      return;
    }
    
    loadWalletData();
  }, [isAuthenticated, token]);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [walletInfo, transactionHistory] = await Promise.all([
        walletService.getWalletInfo(),
        walletService.getTransactionHistory()
      ]);

      setWalletData({
        balance: walletInfo.balance || 0,
        totalEarnings: walletInfo.totalEarnings || 0,
        totalWithdrawals: walletInfo.totalWithdrawals || 0,
        transactions: transactionHistory.transactions || []
      });
    } catch (err) {
      console.error('Error loading wallet data:', err);
      if (err.message.includes('Authentication required') || err.message.includes('Access token is required')) {
        setError('Authentication required. Please log in again.');
        // Could redirect to login here if needed
        // navigate('/login');
      } else {
        setError('Failed to load wallet data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const handleWithdrawCancel = () => {
    setShowWithdrawModal(false);
    setWithdrawalForm({
      amount: '',
      bankName: '',
      bankAccountNumber: '',
      accountHolderName: '',
      routingNumber: ''
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawalForm.amount);
    
    // Validation
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount > walletData.balance) {
      alert('Insufficient balance');
      return;
    }
    
    if (!withdrawalForm.bankName || !withdrawalForm.bankAccountNumber || !withdrawalForm.accountHolderName) {
      alert('Please fill in all required bank account information');
      return;
    }

    setWithdrawing(true);
    
    try {
      await walletService.withdrawFunds(withdrawalForm);
      
      // Refresh wallet data after successful withdrawal
      await loadWalletData();
      
      setShowWithdrawModal(false);
      setWithdrawalForm({
        amount: '',
        bankName: '',
        bankAccountNumber: '',
        accountHolderName: '',
        routingNumber: ''
      });
      
      alert('Withdrawal request submitted successfully!');
    } catch (err) {
      console.error('Withdrawal error:', err);
      alert(err.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="wallet-container">
        <div className="error-message">
          <h3>Authentication Required</h3>
          <p>Please log in to access your wallet</p>
          <button onClick={() => navigate('/login')} className="login-btn">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wallet-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wallet-container">
        <div className="error-message">
          <h3>Error loading wallet</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h1>My Wallet</h1>
        <p>Manage your earnings and withdrawals</p>
      </div>

      <div className="wallet-stats">
        <div className="stat-card balance-card">
          <div className="stat-content">
            <h3>Available Balance</h3>
            <p className="stat-value">${walletData?.balance?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>

      <div className="wallet-actions">
        <button 
          className="withdraw-btn" 
          onClick={handleWithdrawClick}
          disabled={!walletData || walletData.balance <= 0}
        >
          💳 Withdraw Funds
        </button>
      </div>

      {/* Transaction History */}
      <div className="transaction-history">
        <h3>Recent Transactions</h3>
        {walletData?.transactions && walletData.transactions.length > 0 ? (
          <div className="transaction-list">
            {walletData.transactions.map((transaction) => (
              <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-icon">
                  {transaction.type === 'earning' ? '💰' : '💸'}
                </div>
                <div className="transaction-details">
                  <div className="transaction-description">{transaction.description}</div>
                  <div className="transaction-date">{transaction.date}</div>
                </div>
                <div className={`transaction-amount ${transaction.amount > 0 ? 'positive' : 'negative'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-transactions">
            <p>No transactions yet</p>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>💳 Withdraw Funds</h2>
              <button className="close-btn" onClick={handleWithdrawCancel}>×</button>
            </div>
            
            <form onSubmit={handleWithdrawSubmit} className="withdrawal-form">
              <div className="form-section">
                <h3>Withdrawal Amount</h3>
                <div className="form-group">
                  <label htmlFor="amount">Amount ($)</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={withdrawalForm.amount}
                    onChange={handleFormChange}
                    placeholder="0.00"
                    min="0.01"
                    max={walletData?.balance || 0}
                    step="0.01"
                    required
                  />
                  <small>Available balance: ${walletData?.balance?.toFixed(2) || '0.00'}</small>
                </div>
              </div>

              <div className="form-section">
                <h3>Bank Account Information</h3>
                <div className="form-group">
                  <label htmlFor="accountHolderName">Account Holder Name *</label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={withdrawalForm.accountHolderName}
                    onChange={handleFormChange}
                    placeholder="Full name as on bank account"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bankName">Bank Name *</label>
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={withdrawalForm.bankName}
                    onChange={handleFormChange}
                    placeholder="Your bank name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bankAccountNumber">Account Number *</label>
                  <input
                    type="text"
                    id="bankAccountNumber"
                    name="bankAccountNumber"
                    value={withdrawalForm.bankAccountNumber}
                    onChange={handleFormChange}
                    placeholder="Your account number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="routingNumber">Routing Number (Optional)</label>
                  <input
                    type="text"
                    id="routingNumber"
                    name="routingNumber"
                    value={withdrawalForm.routingNumber}
                    onChange={handleFormChange}
                    placeholder="Bank routing number"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={handleWithdrawCancel}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn" 
                  disabled={withdrawing}
                >
                  {withdrawing ? (
                    <>
                      <span className="loading-dot"></span>
                      Processing...
                    </>
                  ) : (
                    'Withdraw Funds'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
