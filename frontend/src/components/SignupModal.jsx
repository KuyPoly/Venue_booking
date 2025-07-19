import React, { useState } from 'react';
import './SignupModal.css';

const SignupModal = ({ onClose }) => {
  const [role, setRole] = useState('guest');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phoneNumber: form.phone,
          password: form.password,
          role: role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        onClose();
      } else {
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="signup-overlay">
      <div className="signup-box">
        <h2 className="section-title">Signup</h2>

        <div className="role-switch">
          <button
            className={role === 'guest' ? 'active' : ''}
            onClick={() => setRole('guest')}
          >
            👤 Guest
          </button>
          <button
            className={role === 'owner' ? 'active' : ''}
            onClick={() => setRole('owner')}
          >
            🧳 Owner
          </button>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="register-btn" onClick={handleRegister}>
          Register
        </button>

        <p className="switch-login">
          Already have an account? <span onClick={onClose}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
