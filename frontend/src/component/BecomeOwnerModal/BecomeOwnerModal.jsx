import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './BecomeOwnerModal.css';

const BecomeOwnerModal = ({ isOpen, onClose }) => {
  const { user, login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    agreeToTerms: false,
    agreeToCommission: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.agreeToTerms || !formData.agreeToCommission) {
      setError('Please agree to all terms and conditions');
      setLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/auth/become-owner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Update user context with new role
        const updatedUser = { ...user, role: 'owner' };
        login({ token, user: updatedUser });
        
        setSuccess(true);
        setTimeout(() => {
          onClose();
          // Redirect to dashboard
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setError(data.message || 'Failed to upgrade to owner account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal-content success-modal">
          <div className="success-icon">✓</div>
          <h2>Welcome to Our Venue Owner Program!</h2>
          <p>Your account has been successfully upgraded. You'll be redirected to your dashboard shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Become a Venue Owner</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Join thousands of venue owners who trust us to grow their business. 
            Fill out the form below to get started.
          </p>

          <form onSubmit={handleSubmit} className="owner-form">
            <div className="form-group">
              <label>Business Name *</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                placeholder="Enter your business name"
              />
            </div>

            <div className="form-group">
              <label>Business Type *</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
              >
                <option value="">Select business type</option>
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="event_hall">Event Hall</option>
                <option value="conference_center">Conference Center</option>
                <option value="wedding_venue">Wedding Venue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Business Address *</label>
              <textarea
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                required
                placeholder="Enter your business address"
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Business Phone *</label>
                <input
                  type="tel"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  required
                  placeholder="Business phone number"
                />
              </div>

              <div className="form-group">
                <label>Business Email *</label>
                <input
                  type="email"
                  name="businessEmail"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  placeholder="Business email address"
                />
              </div>
            </div>

            <div className="terms-section">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                </label>
              </div>

              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeToCommission"
                    checked={formData.agreeToCommission}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  I understand and agree to the commission structure (0% commission on direct bookings)
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Processing...' : 'Become a Venue Owner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeOwnerModal;
