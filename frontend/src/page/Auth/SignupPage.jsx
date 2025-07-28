import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          role
        }),
      });

      const data = await response.json();

      if (data.success) {
        login({
          token: data.token,
          user: data.user
        });
        navigate(role === 'owner' ? '/dashboard' : '/');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2>Create Account</h2>
        
        <div className="role-selector">
          <label>
            <input
              type="radio"
              value="customer"
              checked={role === 'customer'}
              onChange={(e) => setRole(e.target.value)}
            />
            Customer
          </label>
          <label>
            <input
              type="radio"
              value="owner"
              checked={role === 'owner'}
              onChange={(e) => setRole(e.target.value)}
            />
            Venue Owner
          </label>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-row">
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
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="tel"
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
            minLength="6"
          />

          <input
            type="date"
            name="dob"
            placeholder="Date of Birth"
            value={form.dob}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
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

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <button onClick={() => navigate('/')}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
