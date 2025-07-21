// src/components/Topbar.jsx
import React from 'react';
import './Topbar.css';

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="account">
        <i className="fas fa-user-circle"></i>
        My Account
        <select>
          <option></option>
        </select>
      </div>
      <div className="help">
        <i className="fas fa-question-circle"></i>
        Learn More
      </div>
    </header>
  );
}
