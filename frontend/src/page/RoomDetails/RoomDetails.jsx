import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaSnowflake, FaChair, FaWifi, FaHeadset, FaChalkboard, FaRestroom, FaVolumeUp, FaMicrophone, FaTag, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import './RoomDetails.css';
import image2 from '../../assets/image2.png'; // Placeholder image
import image3 from '../../assets/image3.png'; // Placeholder image
import image4 from '../../assets/image4.png'; // Placeholder image
import image5 from '../../assets/image5.png'; // Placeholder image
import { AuthContext } from '../../context/AuthContext';
import FavoriteModal from '../../component/HomePage/FavoriteModal';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

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
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('2025-07-06');
  const [startTime, setStartTime] = useState('07:30');
  const [endTime, setEndTime] = useState('12:00');
  const [guests, setGuests] = useState(50);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, token } = React.useContext(AuthContext);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

  // Fetch favorites for logged-in user
  const fetchFavorites = async () => {
    if (!isAuthenticated || !token) {
      setFavoriteIds([]);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/favorites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFavoriteIds(data.map(v => v.id));
      }
    } catch (error) {
      setFavoriteIds([]);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated, token]);

  const handleFavoriteClick = async (e, venueId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowFavoriteModal(true);
      return;
    }
    if (favoriteIds.includes(venueId)) {
      await fetch(`http://localhost:5000/favorites/${venueId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      await fetch('http://localhost:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hallId: venueId })
      });
    }
    fetchFavorites();
  };

  useEffect(() => {
    const fetchVenue = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/venues/${id}`);
        if (!res.ok) throw new Error('Failed to fetch venue');
        const data = await res.json();
        setVenue(data);
      } catch (err) {
        setVenue(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hallId: id,
          date,
          startTime,
          endTime,
          guests: Number(guests),
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      setBookingSuccess(true);
      setShowPayment(true);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="room-details-container"><div>Loading venue details...</div></div>;
  }
  if (!venue) {
    return <div className="room-details-container"><div>Venue not found.</div></div>;
  }

  // Use venue.images if available, else fallback to galleryImages
  const images = venue.images && venue.images.length > 0 ? venue.images : galleryImages;
  const featuresList = venue.features || features;

  const handlePrevImage = () => {
    setSelectedImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNextImage = () => {
    setSelectedImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };
  const handleThumbnailClick = (idx) => {
    setSelectedImageIdx(idx);
  };

  return (
    <div className="room-details-container">
      <button className="top-left-back-btn" onClick={() => navigate(-1)} aria-label="Back"> <FaChevronLeft /> Back</button>
      <FavoriteModal open={showFavoriteModal} onClose={() => setShowFavoriteModal(false)} />
      <div className="room-main-content">
        {/* Left: Images and Venue Info */}
        <div className="room-gallery-info">
          <div className="room-gallery-card">
            <div className="main-gallery-image">
              <button className="carousel-btn left" onClick={handlePrevImage} aria-label="Previous image"><FaChevronLeft /></button>
              <img src={images[selectedImageIdx]} alt="Room" />
              <button className="carousel-btn right" onClick={handleNextImage} aria-label="Next image"><FaChevronRight /></button>
            </div>
            <div className="gallery-thumbnails">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className={selectedImageIdx === idx ? 'selected' : ''}
                  onClick={() => handleThumbnailClick(idx)}
                />
              ))}
            </div>
            <div className="venue-info-card">
              <div className="venue-title-row">
                <h2>{venue.name}</h2>
                <span 
                  className={`like${favoriteIds.includes(venue.id) ? ' liked' : ''}`}
                  onClick={e => handleFavoriteClick(e, venue.id)}
                  title={isAuthenticated ? (favoriteIds.includes(venue.id) ? 'Remove from favorites' : 'Add to favorites') : 'Login to favorite'}
                  style={{ cursor: 'pointer', marginLeft: '12px' }}
                >
                  {favoriteIds.includes(venue.id) ? (
                    <FaHeart className="favorite-icon filled" />
                  ) : (
                    <FaRegHeart className="favorite-icon" />
                  )}
                </span>
              </div>
              <div className="venue-meta">
                <span className="venue-price">{venue.price ? `$${venue.price}` : 'N/A'}</span>
                <span className="venue-location">{venue.location || 'N/A'}</span>
              </div>
              <p className="venue-description">{venue.description}</p>
              <h3>Feature</h3>
              <div className="room-features">
                {featuresList.map((feature, idx) => (
                  <span key={idx} className="feature-tag">
                    <span style={{ marginRight: '8px', fontSize: '1.2em' }}>{feature.icon || ''}</span>
                    {feature.label || feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Right: Booking Form */}
        <div className="room-booking-form">
          {!showPayment ? (
            <>
              <h3>Booking Hall</h3>
              <form onSubmit={handleBookingSubmit}>
                <label>Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <div className="time-row">
                  <div>
                    <label>Start time</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                  </div>
                  <div>
                    <label>Finish time</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />
                  </div>
                </div>
                <label>Guests</label>
                <input type="number" min="1" value={guests} onChange={e => setGuests(e.target.value)} required />
                {bookingError && <div className="booking-error">{bookingError}</div>}
                <button type="submit" className="continue-btn" disabled={bookingLoading}>{bookingLoading ? 'Booking...' : 'Continue'}</button>
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
              <div className="payment-total">Total Price : ${venue.price || 1000}</div>
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
              {bookingSuccess && <div className="booking-success">Booking successful!</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
