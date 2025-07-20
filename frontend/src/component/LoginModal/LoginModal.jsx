import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = () => {
    onClose();
    navigate('/signup');
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        alert("Login successful!");
        onClose();
        navigate('/'); // Navigate to home page
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
          Don't have an account? <span onClick={handleRegisterClick} style={{cursor: 'pointer', color: '#003366'}}>Register</span>
        </p>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default LoginModal;
