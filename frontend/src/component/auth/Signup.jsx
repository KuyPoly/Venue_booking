import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './auth.css';

export default function Signup() {
  const { login } = useContext(AuthContext);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
      
    const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Auto-login after successful registration
      const loginRes = await fetch(`${apiUrl}/api/auth/login`, {
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
      } else {
        alert('Registration successful! Please login.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Sign Up</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-row">
        <input 
          name="firstName" 
          value={form.firstName} 
          onChange={handleChange} 
          placeholder="First Name" 
          required 
        />
        <input 
          name="lastName" 
          value={form.lastName} 
          onChange={handleChange} 
          placeholder="Last Name" 
          required 
        />
      </div>

      <input 
        name="email" 
        type="email" 
        value={form.email} 
        onChange={handleChange} 
        placeholder="Email" 
        required 
      />
      
      <input 
        name="phoneNumber" 
        value={form.phoneNumber} 
        onChange={handleChange} 
        placeholder="Phone Number" 
        required 
      />
      
      <input 
        name="password" 
        type="password" 
        value={form.password} 
        onChange={handleChange} 
        placeholder="Password" 
        required 
      />
      
      <input 
        name="dob" 
        type="date" 
        value={form.dob} 
        onChange={handleChange} 
        placeholder="Date of Birth" 
        required 
      />
      
      <textarea 
        name="address" 
        value={form.address} 
        onChange={handleChange} 
        placeholder="Address" 
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
      
      <button type="submit" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
}
