import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaSnowflake, FaChair, FaWifi, FaHeadset, FaChalkboard, FaRestroom, FaVolumeUp, FaMicrophone, FaTag, FaMapMarkerAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import './RoomDetails.css';
import image2 from '../../assets/image2.png'; // Placeholder image
import image3 from '../../assets/image3.png'; // Placeholder image
import image4 from '../../assets/image4.png'; // Placeholder image
import image5 from '../../assets/image5.png'; // Placeholder image

const galleryImages = [
    image2,
    image3,
    image4,
    image5,
];

const features = [
  { label: 'Air conditioning', icon: <FaSnowflake /> },
  { label: 'Chairs', icon: <FaChair /> },
  { label: 'WiFi', icon: <FaWifi /> },
  { label: 'Tech support', icon: <FaHeadset /> },
  { label: 'Projection screen', icon: <FaChalkboard /> },
  { label: 'Bathroom', icon: <FaRestroom /> },
  { label: 'Sound system', icon: <FaVolumeUp /> },
  { label: 'Microphones', icon: <FaMicrophone /> },
];

export default function RoomDetails() {
  const [date, setDate] = useState('2025-07-06');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('12:00');
  const [guests, setGuests] = useState(50);
  const [showPayment, setShowPayment] = useState(false);

  return (
    <div className="room-details-container">
      <div className="room-header-img">
        <img src={galleryImages[0]} alt="Room" />
        <h1 className="room-title">Room Details</h1>
      </div>
      <div className="room-main-content">
        <div className="room-gallery-info">
          <div className="room-gallery">
            {galleryImages.slice(1).map((img, idx) => (
              <img key={idx} src={img} alt={`Gallery ${idx + 1}`} />
            ))}
          </div>
          <div className="room-info">
            <h2>Conference Hall</h2>
            <div className="room-meta">
              <span className="room-price-row">
                <FaTag className="fa-tag" />
                1000$ - 2000$
                <span className="room-stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="fa-star" />
                  ))}
                </span>
              </span>
              <span className="room-location-row">
                <FaMapMarkerAlt className="fa-map-marker-alt" />
                Boeung Keng Kang 1
              </span>
            </div>
            <p>
              The Conference Hall is a spacious, modern, and fully-equipped event room designed to accommodate a wide range of events including workshops, meetings, training sessions, seminars, and small conferences. With a flexible layout and a maximum capacity of <b>100 guests</b>, it is ideal for both formal and casual gatherings.
            </p>
            <h3>Feature</h3>
            <div className="room-features">
              {features.map((feature, idx) => (
                <span key={idx} className="feature-tag">
                  <span style={{ marginRight: '8px', fontSize: '1.2em' }}>{feature.icon}</span>
                  {feature.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="room-booking-form">
          {!showPayment ? (
            <>
              <h3>Booking Hall</h3>
              <form onSubmit={e => { e.preventDefault(); setShowPayment(true); }}>
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                <div className="time-row">
                  <div>
                    <label>Start time</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  </div>
                  <div>
                    <label>Finish time</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </div>
                </div>
                <label>Guests</label>
                <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} />
                <button type="submit" className="continue-btn">Continue</button>
              </form>
            </>
          ) : (
            <div className="payment-form">
              <h2 className="payment-title">Payment</h2>
              <label>Date</label>
              <input type="date" value={date} readOnly />
              <div className="time-row">
                <div>
                  <label>Start time</label>
                  <input type="time" value={startTime} readOnly />
                </div>
                <div>
                  <label>Finish time</label>
                  <input type="time" value={endTime} readOnly />
                </div>
              </div>
              <label>Guests</label>
              <input type="number" min="1" value={guests} readOnly />
              <div className="payment-total">Total Price : $1000</div>
              <div className="payment-method-label">Choose payment method</div>
              <div className="payment-method-row">
                <button type="button" className="payment-method-btn">
                  <span role="img" aria-label="credit-card" className="credit-card-icon">💳</span> Credit Card
                </button>
                <button type="button" className="payment-method-btn">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/7e/ABA_Bank_logo.png" alt="ABA" className="aba-logo" /> ABA
                </button>
              </div>
              <button type="button" className="pay-now-btn">Pay Now</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
