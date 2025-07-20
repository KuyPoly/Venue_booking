import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './SignupModal.css';

const SignupModal = ({ onClose, onSwitchToLogin }) => {
  const { login } = useContext(AuthContext);
  const [role, setRole] = useState('customer'); // Add role state back
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    dob: '',
    address: '',
    gender: 'male'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phoneNumber,
          password: form.password,
          dob: form.dob,
          address: form.address,
          gender: form.gender,
          role: role // Use selected role instead of hardcoded 'customer'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login after successful registration
        const loginRes = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          }),
        });

        const loginData = await loginRes.json();
        
        if (loginRes.ok) {
          login(loginData.token, loginData.user);
          alert('Registration successful! You are now logged in.');
          onClose();
        } else {
          alert('Registration successful! Please login.');
          onClose();
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    onClose();
    if (onSwitchToLogin) onSwitchToLogin();
  };

  return (
    <div className="signup-overlay">
      <div className="signup-box">
        <h2 className="section-title">Signup</h2>

        {error && <div className="error-message">{error}</div>}

        {/* Add role selection UI back */}
        <div className="role-switch">
          <button 
            type="button"
            className={role === 'customer' ? 'active' : ''} 
            onClick={() => setRole('customer')}
          >
            Customer
          </button>
          <button 
            type="button"
            className={role === 'owner' ? 'active' : ''} 
            onClick={() => setRole('owner')}
          >
            Venue Owner
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={form.dob}
          onChange={handleChange}
          required
        />
        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          rows="3"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <button 
          className="register-btn" 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        <p className="switch-login">
          Already have an account? <span onClick={handleLoginClick} style={{cursor: 'pointer', color: '#003366'}}>Login</span>
        </p>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default SignupModal;