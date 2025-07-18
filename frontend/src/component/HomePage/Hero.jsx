import React, { useEffect, useState } from 'react';
import bgImage from '../../assets/image1.png';
import './Home.css';

export default function Hero() {
  const [backendMessage, setBackendMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(response => response.text())
      .then(data => setBackendMessage(data))
      .catch(error => setBackendMessage('Error fetching backend data'));
  }, []);

  return (
    <div className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-overlay">
        <h1 className="hero-title">Discover Top Event Venues in Cambodia!</h1>
        <p className="hero-subtitle">
          Perfect spaces for weddings, birthdays, meetings, parties, and corporate events — all in one place. 
          Book your dream venue today!
        </p>
        <div className="search-box">
          <input type="text" placeholder="📍 Target Location" />
          <input type="number" placeholder="👥 No. of Guests" />
          <input type="text" placeholder="💲 Budget" />
          <button className="search-btn">🔍 Search</button>
        </div>
      </div>
    </div>
  );
}
