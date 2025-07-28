import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  FaChartLine, 
  FaGlobe, 
  FaCreditCard, 
  FaUsers, 
  FaStar,
  FaCalendarCheck,
  FaDollarSign,
  FaHandshake
} from 'react-icons/fa';
import BecomeOwnerModal from '../../component/BecomeOwnerModal/BecomeOwnerModal';
import LoginModal from '../../component/LoginModal/LoginModal';
import './Listing.css';

const Listing = () => {
  const { user } = useContext(AuthContext);
  const [showBecomeOwnerModal, setShowBecomeOwnerModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleJoinUsClick = (e) => {
    e.preventDefault();
    
    if (!user) {
      // User is not logged in, show login modal
      setShowLoginModal(true);
    } else if (user.role === 'owner') {
      // User is already an owner, redirect to dashboard or show message
      window.location.href = '/dashboard';
    } else {
      // User is logged in but not an owner, show become owner modal
      setShowBecomeOwnerModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // After successful login, show the become owner modal
    setShowBecomeOwnerModal(true);
  };

  return (
    <div className="listing-container">{/* Hero Section */}
      <section className="listing-section">
        <div className="listing-overlay">
          <div className="listing-content">
            <h1>Join the leading venue marketplace in Cambodia.</h1>
            <p>Get more booking for your event space business</p>
            <button onClick={handleJoinUsClick} className="cta-btn">JOIN US TODAY</button>
          </div>
        </div>
      </section>

      {/* Why Work With Us Section */}
      <section className="why-work-section">
        <div className="container-work">
          <h2>Why work with us?</h2>
          <p className="work-subtitle">
            We partner with the world's best venues to grow their event booking business, giving them 
            access to over $250M of event value each year
          </p>

          <div className="features-grid">
            {/* Feature 1 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartLine />
              </div>
              <h3>All-in-one digital marketing tool</h3>
              <ul>
                <li>Flexible photography and video production</li>
                <li>SEO optimised platform and profiles</li>
                <li>Automated marketing to reach the highest value customers</li>
                <li>Lead organisation</li>
                <li>Reporting on venue impressions, visits & bookings</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FaDollarSign />
              </div>
              <h3>Access to £250M of event value</h3>
              <ul>
                <li>Corporate events, private dining & drinks</li>
                <li>Business events, from meetings to drinks receptions</li>
                <li>Weddings</li>
                <li>Private parties including birthdays, baby showers, Christmas & summer parties, with event budgets from £100 to £15,000+ per event value</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FaCreditCard />
              </div>
              <h3>Pay 0% commission on bookings</h3>
              <ul>
                <li>We give you the leads to convert event books directly with event organisers</li>
                <li>You and your customer contact direct so you win their business</li>
                <li>Pay only when you get leads - upfront direct with the event organisers</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="feature-card">
              <div className="feature-icon">
                <FaUsers />
              </div>
              <h3>Access our agency client list</h3>
              <ul>
                <li>Network Events for Business works with top brands</li>
                <li>Event agencies, corporate event planners</li>
                <li>Number venues get exclusive access £15,000 average booking value</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <h2>What The Standard say about Ocean Gate:</h2>
          <div className="testimonial-card">
            <div className="quote-icon">"</div>
            <p>
              Couldn't recommend enough! Joanna, Jack, and the team at Ocean Gate are fantastic. 
              They consistently send us high-level, quality leads - selling our spaces to the high 
              standards each deserves. They genuinely care and live our property, and that shines 
              through.
            </p>
          </div>
        </div>
      </section>

      {/* Modals */}
      <BecomeOwnerModal 
        isOpen={showBecomeOwnerModal} 
        onClose={() => setShowBecomeOwnerModal(false)} 
      />
      
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

    </div>
  );
};

export default Listing;