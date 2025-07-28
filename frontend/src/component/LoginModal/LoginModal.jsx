import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './LoginModal.css';

const LoginModal = ({ onClose, onSwitchToSignup, onSuccess }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = () => {
    onClose();
    if (onSwitchToSignup) onSwitchToSignup();
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.login({ email, password });
      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        alert("Login successful!");
        onClose();
        
        // Call onSuccess callback if provided, otherwise navigate to home
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/'); // Navigate to home page
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="section-title">Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(''); // Clear error when user types
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(''); // Clear error when user types
          }}
          required
        />
        <button 
          className="login-btn1" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <p className="switch-register">
          Not yet have an account? <span onClick={handleRegisterClick} style={{cursor: 'pointer', color: '#003366'}}>Sign up</span>
        </p>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default LoginModal;
