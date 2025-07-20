// ./component/auth/Login.jsx
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './auth.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token, data.user);
      alert('Login successful!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <input 
        name="email" 
        type="email" 
        value={form.email} 
        onChange={handleChange} 
        placeholder="Email" 
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
      <button type="submit" disabled={loading}>
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
}
