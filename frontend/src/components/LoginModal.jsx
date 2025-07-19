import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterClick = () => {
    onClose();
    navigate('/signup');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        localStorage.setItem("token", data.token); // if JWT is returned
        onClose();
        navigate('/dashboard'); // or your home/dashboard page
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2 className="section-title">Login</h2>
        <input
          type="text"
          placeholder="UserName/Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-btn1" onClick={handleLogin}>Login</button>
        <p className="switch-register">
          Don’t have an account? <span onClick={handleRegisterClick} style={{cursor: 'pointer', color: '#003366'}}>Register</span>
        </p>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>
    </div>
  );
};

export default LoginModal;
