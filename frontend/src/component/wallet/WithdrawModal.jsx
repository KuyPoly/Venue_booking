import React, { useState } from 'react';
import walletService from '../services/walletService';
import './WithdrawModal.css';

const WithdrawModal = ({ isOpen, onClose, onSuccess, availableBalance }) => {
  const [amount, setAmount] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const maxBalance = parseFloat(availableBalance) || 0;

  const bankOptions = [
    'ABA Bank',
    'ACLEDA Bank',
    'Canadia Bank',
    'Wing Bank',
    'Cambodia Post Bank',
    'ANZ Royal Bank',
    'Maybank',
    'BRED Bank',
    'Other'
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setAmount(value);
    }
  };

  const handleQuickAmount = (percentage) => {
    const quickAmount = (maxBalance * percentage / 100).toFixed(2);
    setAmount(quickAmount);
  };

  const validateForm = () => {
    const numAmount = parseFloat(amount);
    
    if (!amount || numAmount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    
    if (numAmount < 10) {
      setError('Minimum withdrawal amount is $10');
      return false;
    }
    
    if (numAmount > maxBalance) {
      setError('Amount exceeds available balance');
      return false;
    }
    
    if (!accountHolderName.trim()) {
      setError('Please enter account holder name');
      return false;
    }
    
    if (!bankName) {
      setError('Please select a bank');
      return false;
    }
    
    if (!accountNumber.trim()) {
      setError('Please enter account number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const withdrawalData = {
        amount: parseFloat(amount),
        account_holder_name: accountHolderName.trim(),
        bank_name: bankName,
        account_number: accountNumber.trim()
      };

      await walletService.withdrawFunds(withdrawalData);
      
      setStep(3); // Success step
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      setError(error.message || 'Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setAccountHolderName('');
    setBankName('');
    setAccountNumber('');
    setError('');
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="withdraw-modal-overlay">
      <div className="withdraw-modal">
        <div className="withdraw-modal-header">
          <h2>💸 Withdraw Funds</h2>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        {step === 1 && (
          <div className="withdraw-step">
            <h3>Step 1: Enter Amount</h3>
            <div className="amount-section">
              <div className="balance-info">
                <span>Available balance: </span>
                <strong>${maxBalance.toFixed(2)}</strong>
              </div>
              
              <div className="amount-input-group">
                <label>Withdrawal Amount</label>
                <div className="amount-input-wrapper">
                  <span className="currency-symbol">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="0.00"
                    min="10"
                    max={maxBalance}
                    step="0.01"
                  />
                </div>
              </div>

              <div className="quick-amounts">
                <span>Quick amounts:</span>
                <div className="quick-amount-buttons">
                  <button 
                    type="button" 
                    onClick={() => handleQuickAmount(25)}
                    className="quick-amount-btn"
                  >
                    25%
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickAmount(50)}
                    className="quick-amount-btn"
                  >
                    50%
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickAmount(75)}
                    className="quick-amount-btn"
                  >
                    75%
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleQuickAmount(100)}
                    className="quick-amount-btn"
                  >
                    100%
                  </button>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="step-actions">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  disabled={!amount || parseFloat(amount) < 10 || parseFloat(amount) > maxBalance}
                  className="next-btn"
                >
                  Next: Bank Details
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="withdraw-step">
            <h3>Step 2: Bank Account Details</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Account Holder Name</label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) => setAccountHolderName(e.target.value)}
                  placeholder="Full name as on bank account"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  required
                >
                  <option value="">Select your bank</option>
                  {bankOptions.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Your bank account number"
                  required
                />
              </div>

              <div className="withdrawal-summary">
                <h4>Withdrawal Summary</h4>
                <div className="summary-row">
                  <span>Amount:</span>
                  <strong>${parseFloat(amount || 0).toFixed(2)}</strong>
                </div>
                <div className="summary-row">
                  <span>Bank:</span>
                  <strong>{bankName || 'Not selected'}</strong>
                </div>
                <div className="summary-row">
                  <span>Account:</span>
                  <strong>{accountNumber || 'Not entered'}</strong>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="step-actions">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="back-btn"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="submit-btn"
                >
                  {loading ? 'Processing...' : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="withdraw-step success-step">
            <div className="success-icon">✅</div>
            <h3>Withdrawal Submitted!</h3>
            <p>Your withdrawal request has been submitted successfully.</p>
            <div className="success-details">
              <p><strong>Amount:</strong> ${parseFloat(amount).toFixed(2)}</p>
              <p><strong>Bank:</strong> {bankName}</p>
              <p><strong>Account:</strong> {accountNumber}</p>
            </div>
            <div className="success-note">
              <p>💡 Your funds will be processed within 1-3 business days.</p>
              <p>📧 You'll receive an email confirmation shortly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawModal;
