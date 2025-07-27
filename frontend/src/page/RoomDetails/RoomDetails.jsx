import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaSnowflake, FaChair, FaWifi, FaHeadset, FaChalkboard, FaRestroom, FaVolumeUp, FaMicrophone, FaTag, FaMapMarkerAlt, FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './RoomDetails.css';
import './confirmation-overlay.css';
import ConfirmationOverlay from './ConfirmationOverlay';
import image2 from '../../assets/image2.png'; // Placeholder image
import image3 from '../../assets/image3.png'; // Placeholder image
import image4 from '../../assets/image4.png'; // Placeholder image
import image5 from '../../assets/image5.png'; // Placeholder image
import { AuthContext } from '../../context/AuthContext';
import SignupPopUp from '../../component/HomePage/SignupPopUp';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import config from '../../config/config';

// Google Maps configuration
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

const defaultCenter = config.googleMaps.defaultCenter;

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
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
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
  const [bookingId, setBookingId] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, token } = React.useContext(AuthContext);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [guestError, setGuestError] = useState('');
  const [showMapModal, setShowMapModal] = useState(false);

  // Google Maps loading
  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMaps.apiKey,
    libraries: ['places']
  });

  // Get venue location for map
  const venueLocation = venue && venue.latitude && venue.longitude 
    ? { lat: parseFloat(venue.latitude), lng: parseFloat(venue.longitude) }
    : null;

  // Geocode venue location if coordinates aren't available
  const [geocodedLocation, setGeocodedLocation] = useState(null);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  
  useEffect(() => {
    const geocodeVenueLocation = async () => {
      if (!venue || venueLocation || !venue.location) return;
      
      setGeocodingLoading(true);
      try {
        // Use Google Maps Geocoding API to get coordinates from address
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(venue.location)}&key=${config.googleMaps.apiKey}`
        );
        const data = await response.json();
        
        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setGeocodedLocation({
            lat: location.lat,
            lng: location.lng
          });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      } finally {
        setGeocodingLoading(false);
      }
    };

    geocodeVenueLocation();
  }, [venue, venueLocation]);

  // Use geocoded location as fallback
  const finalVenueLocation = venueLocation || geocodedLocation;

  // Debug venue location
  console.log('Venue data:', venue);
  console.log('Venue location:', venueLocation);
  console.log('Geocoded location:', geocodedLocation);
  console.log('Final venue location:', finalVenueLocation);
  console.log('Venue coordinates:', venue ? { lat: venue.latitude, lng: venue.longitude } : 'No venue');
  console.log('Venue address:', venue?.address);
  console.log('Venue location string:', venue?.location);

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
    if (!isAuthenticated) {
      setShowSignupModal(true);
      return;
    }

    // Validate guest count against venue capacity
    if (venue && guests > venue.capacity) {
      setGuestError(`Maximum capacity for this venue is ${venue.capacity} guests`);
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setGuestError('');
    setBookingSuccess(false);
    try {
      const res = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add JWT token for authentication
        },
        body: JSON.stringify({
          hallId: id,
          date,
          startTime,
          endTime,
          guests: Number(guests),
        }),
      });
      if (!res.ok) throw new Error('Booking failed');
      const data = await res.json();
      setBookingId(data.id); // <-- Set bookingId from backend response
      setBookingSuccess(true);
      setShowPayment(true);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle guest input change with validation
  const handleGuestChange = (e) => {
    const value = parseInt(e.target.value);
    setGuests(value);
    
    // Clear previous error
    setGuestError('');
    
    // Validate against venue capacity
    if (venue && value > venue.capacity) {
      setGuestError(`Maximum capacity for this venue is ${venue.capacity} guests`);
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
      <SignupPopUp open={showFavoriteModal} onClose={() => setShowFavoriteModal(false)} />
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
                <button 
                  className="see-location-btn"
                  onClick={() => setShowMapModal(true)}
                  title="View on map"
                >
                  <FaMapMarkerAlt /> See location
                </button>
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
        {!showPayment ? (
          <div className="room-booking-form">
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
              <input 
                type="number" 
                min="1" 
                max={venue ? venue.capacity : undefined}
                value={guests} 
                onChange={handleGuestChange} 
                required 
              />
              {guestError && <div className="booking-error">{guestError}</div>}
              {bookingError && <div className="booking-error">{bookingError}</div>}
              <button type="submit" className="continue-btn" disabled={bookingLoading || guestError}>
                {bookingLoading ? 'Booking...' : 'Continue'}
              </button>
            </form>
          </div>
        ) : (
          <div className="room-booking-form">
            <h2 className="payment-title">Payment</h2>
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
            <input 
              type="number" 
              min="1" 
              max={venue ? venue.capacity : undefined}
              value={guests} 
              onChange={handleGuestChange} 
            />
            {guestError && <div className="booking-error">{guestError}</div>}
            <div className="payment-total">Total Price : ${venue.price || 1000}</div>
            <div className="payment-method-row">
              <button
                type="button"
                className={`payment-method-btn custom-credit-btn${selectedPayment === 'credit' ? ' selected' : ''}`}
                onClick={() => setSelectedPayment('credit')}
              >
                <svg className="credit-card-svg" width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="10" width="28" height="20" rx="3" fill="#fff" stroke="#333" strokeWidth="2"/>
                  <rect x="6" y="16" width="28" height="4" fill="#333"/>
                </svg>
                <span className="custom-btn-label">Credit Card</span>
              </button>
              <button
                type="button"
                className={`payment-method-btn custom-paypal-btn${selectedPayment === 'paypal' ? ' selected' : ''}`}
                onClick={() => setSelectedPayment('paypal')}
              >
                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="paypal-logo" style={{height:'32px',marginRight:'8px'}} />
                <span className="custom-btn-label" style={{fontWeight:'bold',color:'#253b80'}}>
                  <span style={{color:'#253b80',fontWeight:'bold',fontFamily:'Arial'}}>Pay</span><span style={{color:'#179bd7',fontWeight:'bold',fontFamily:'Arial'}}>Pal</span>
                </span>
                <span className="custom-btn-label"></span>
              </button>
            </div>
            {selectedPayment === 'credit' && (
              <form className="credit-form" onSubmit={async e => {
                e.preventDefault();
                setPaymentError('');
                setPaymentSuccess(false);
                setPaymentLoading(true);
                try {
                  const response = await fetch('http://localhost:5000/payments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      paid_at: new Date().toISOString(),
                      status: 'paid',
                      method: 'credit_card',
                      booking_id: bookingId,
                    }),
                  });
                  if (!response.ok) throw new Error('Payment failed');
                  setPaymentSuccess(true);
                  setShowConfirmation(true);
                } catch (err) {
                  setPaymentError('Payment failed. Please try again.');
                } finally {
                  setPaymentLoading(false);
                }
              }}>
                <label>Card Number</label>
                <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required maxLength={19} placeholder="1234 5678 9012 3456" />
                <label>Name on Card</label>
                <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} required />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Expiry</label>
                    <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} required placeholder="MM/YY" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>CVC</label>
                    <input type="text" value={cardCVC} onChange={e => setCardCVC(e.target.value)} required maxLength={4} placeholder="123" />
                  </div>
                </div>
                <button type="submit" className="pay-now-btn" disabled={paymentLoading}>
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>
                {paymentLoading && <div className="payment-loading">Processing payment, please wait...</div>}
              </form>
            )}
            {selectedPayment === 'paypal' && (
              <form className="paypal-form" onSubmit={async e => {
                e.preventDefault();
                setPaymentError('');
                setPaymentSuccess(false);
                setPaymentLoading(true);
                try {
                  const response = await fetch('http://localhost:5000/payments', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      paid_at: new Date().toISOString(),
                      status: 'paid',
                      method: 'paypal',
                      booking_id: bookingId,
                    }),
                  });
                  if (!response.ok) throw new Error('Payment failed');
                  setPaymentSuccess(true);
                  setShowConfirmation(true);
                } catch (err) {
                  setPaymentError('Payment failed. Please try again.');
                } finally {
                  setPaymentLoading(false);
                }
              }}>
                <label>PayPal Email</label>
                <input type="email" value={paypalEmail} onChange={e => setPaypalEmail(e.target.value)} required placeholder="your@email.com" />
                <button type="submit" className="pay-now-btn" disabled={paymentLoading}>
                  {paymentLoading ? 'Processing...' : 'Pay Now'}
                </button>
                {paymentLoading && <div className="payment-loading">Processing payment, please wait...</div>}
              </form>
            )}
            {/* Booking success message removed as requested */}
            {/* Removed old paymentSuccess message, overlay will show instead */}
            {paymentError && <div className="booking-error">{paymentError}</div>}
          </div>
        )}
      </div>
      <ConfirmationOverlay
        show={showConfirmation}
        venue={venue}
        date={date}
        guests={guests}
        totalPrice={venue && guests ? Number(venue.price) : ''}
        onBackHome={() => window.location.href = '/'}
      />
      <SignupPopUp open={showSignupModal} onClose={() => setShowSignupModal(false)} />

      {/* Map Modal */}
      <Modal
        isOpen={showMapModal}
        onRequestClose={() => setShowMapModal(false)}
        className="map-modal"
        overlayClassName="map-modal-overlay"
        contentLabel="Venue Location"
      >
        <div className="map-modal-content">
          <div className="map-modal-header">
            <h3>📍 {venue?.name} - Location</h3>
            <div className="map-modal-actions">
              <button 
                className="get-directions-btn"
                onClick={() => {
                  const venueAddress = venue?.address || venue?.location || venue?.name;
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;
                  window.open(googleMapsUrl, '_blank');
                }}
                title="Open in Google Maps"
              >
                <FaMapMarkerAlt /> Get Directions
              </button>
              <button 
                className="map-modal-close"
                onClick={() => setShowMapModal(false)}
                aria-label="Close map"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="map-modal-body">
            {isMapLoaded ? (
              geocodingLoading ? (
                <div className="map-loading">
                  <p>Finding venue location...</p>
                </div>
              ) : (
                <GoogleMap
                  key={finalVenueLocation ? `${finalVenueLocation.lat}-${finalVenueLocation.lng}` : 'default'}
                  mapContainerStyle={{
                    width: '100%',
                    height: '400px',
                    borderRadius: '8px'
                  }}
                  center={finalVenueLocation || defaultCenter}
                  zoom={finalVenueLocation ? 15 : 10}
                  options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false
                  }}
                >
                  {finalVenueLocation && (
                    <Marker
                      position={finalVenueLocation}
                      title={venue?.name}
                    />
                  )}
                </GoogleMap>
              )
            ) : mapLoadError ? (
              <div className="map-error">
                <p>Unable to load map</p>
                <small>Error: {mapLoadError.message}</small>
              </div>
            ) : (
              <div className="map-loading">
                <p>Loading map...</p>
              </div>
            )}
          </div>

          {venue?.address && (
            <div className="map-modal-footer">
              <div className="venue-address">
                <strong>Address:</strong> {venue.address}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
