import React from 'react';
import './DiscoverAndBook.css';
import "./Home.css";

const DiscoverAndBook = () => {
  return (
    <div className="discover-container">
      <div className="hero-section">
        <h2 className="title">Discover and Book Local Community <br />
        Halls Fast, Simple, and Affordable</h2>
        <p className="subtext">
          Your go-to platform for finding and booking nearby community halls for events,
          workshops, meetings, or social gatherings—all in one place.
        </p>
      </div>

      <div className="cta-sections">
        <div className="cta-card">
          <h3>For venues & spaces</h3>
          <div className="cta-content">
            <p>I want to manage my bookings online</p>
            <li>List your space and get found by locals</li>
            <li>Grow your bookings revenue and increase utilisation</li>
            <li>Automate bookings processes and get your time back</li>
          </div>
          <div className="cta-footer">
            <button className="cta-button">Try our online booking software</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverAndBook;
