import React from "react";
import venues from "./venues";
import "../../page/Homepage/Home.css"; // Import the CSS for styling
import "../../assets/image1.png"; // Import images if needed
import "../../assets/image3.png"; // Import images if needed
import "../../assets/image4.png"; // Import images if needed
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h2 className="section-title">Featured Venues in Phnom Penh</h2>
      <p className="section-subtext">
        Explore outstanding venues for rent across Cambodia — ideal for weddings, parties, meetings, and more. Create unforgettable moments in every event!
      </p>
      <div className="venue-list">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <img src={venue.image} alt={venue.name} className="venue-img" />
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <div className="venue-meta">
                <span>👥 {venue.guests}</span>
                <span>🏷️ {venue.priceRange}</span>
                <span>📍 {venue.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="see-more-container">
        <button className="see-more-btn">See More</button>
      </div>
    </div>
  );
}

export default Home;
