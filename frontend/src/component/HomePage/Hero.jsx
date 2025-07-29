import React, { useState } from 'react';
import bgImage from '../../assets/image1.png';
import '../../page/Homepage/Home.css'; // 
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  // const [backendMessage, setBackendMessage] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [budget, setBudget] = useState('');
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetch('http://localhost:3000/')
  //     .then(response => response.text())
  //     .then(data => setBackendMessage(data))
  //     .catch(error => setBackendMessage('Error fetching backend data'));
  // }, []);

  return (
    <div className="hero" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-overlay">
        <h1 className="hero-title">Discover Top Event Venues in Cambodia!</h1>
        <p className="section-subtitle">
          Find and book the perfect venue for your special occasions
        </p>
        <p className="hero-subtitle">
          Perfect spaces for weddings, birthdays, meetings, parties, <br />and corporate events — all in one place. 
          Book your dream venue today!
        </p>
        <div className="search-box">
          <input
            type="text"
            placeholder="📍 Target Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <input
            type="number"
            placeholder="👥 No. of Guests"
            value={guests}
            onChange={e => setGuests(e.target.value)}
          />
          <input
            type="text"
            placeholder="💲 Budget"
            value={budget}
            onChange={e => setBudget(e.target.value)}
          />
          <button className="search-btn"
            onClick={() =>{
              const params = new URLSearchParams({ 
                location, 
                guests, 
                budget 
              }).toString();
              navigate(`/venuesearch?${params}`);
            }}
          >🔍 Search</button>
        </div>
      </div>
    </div>
  );
}
