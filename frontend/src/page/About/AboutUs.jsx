import React from 'react';
import './AboutUs.css';
import './ListYourSpace.css';
import './FindVenue.css';
import teamImage from '../../assets/image6.png'; // Adjust path as needed
import venueImage from '../../assets/image7.png'; // Adjust path as needed
import perfectVenueImg from '../../assets/image8.png'; // Adjust path as needed

const AboutUs = () => (
  <div>
    {/* About Us Section */}
    <section className="about-us-section">
      <div className="about-us-container">
        <div className="about-us-text">
          <h2 className="about-us-title">About Us</h2>
          <h4 className="about-us-subtitle">
            Safe, comprehensive and fast platform
          </h4>
          <p className="about-us-description">
            At Booking Hall, we connect passionate event hosts with the perfect venues. Whether you're planning a dream wedding, a corporate event, or just a fun gathering, we make venue booking simple, secure, and stress-free.
          </p>
        </div>
        <div className="about-us-image">
          <img src={teamImage} alt="Team collaborating" />
        </div>
      </div>
      <div className="about-us-stats">
        <div className="stat-item">
          <div className="stat-label">Number of Venues</div>
          <div className="stat-value">50,000</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Events Booked</div>
          <div className="stat-value">10,000</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Customer Satisfaction</div>
          <div className="stat-value">100%</div>
        </div>
      </div>
    </section>

    {/* List Your Space Section */}
    <section className="list-space-section">
      <div className="list-space-container">
        <div className="list-space-info">
          <h2 className="list-space-title">
            List your space and earn more
          </h2>
          <ul className="list-space-features">
            <li>Wide variety of venues</li>
            <li>Easy search & booking process</li>
            <li>Verified listings & secure payments</li>
            <li>Transparent pricing & no hidden fees</li>
            <li>Responsive customer support</li>
            <li>Reach thousands of event organizers</li>
            <li>Flexible listing management tools</li>
          </ul>
          <button className="list-space-btn">Browse Now</button>
        </div>
        <div className="list-space-image">
          <img src={venueImage} alt="Outdoor event venue with lights and tables" />
        </div>
      </div>
    </section>

    {/* Find Your Venue Section */}
    <section className="find-venue-section">
      <div className="find-venue-container">
        <div className="find-venue-image">
          <img src={perfectVenueImg} alt="Outdoor decorated wedding venue with lights" />
        </div>
        <div className="find-venue-info">
          <h2 className="find-venue-title">Find Your Perfect Venue</h2>
          <ul className="find-venue-features">
            <li>Wide variety of venues</li>
            <li>Easy search & booking process</li>
            <li>Verified listings & secure payments</li>
            <li>Transparent pricing & no hidden fees</li>
            <li>Personalized recommendations</li>
            <li>Flexible booking options</li>
          </ul>
          <button className="find-venue-btn">Browse Now</button>
        </div>
      </div>
    </section>
  </div>
);

export default AboutUs;