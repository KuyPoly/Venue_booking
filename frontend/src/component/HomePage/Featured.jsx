import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import pancakes from '../../assets/image1.png'; // Fallback image
import { AuthContext } from '../../context/AuthContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HiOutlineUsers } from 'react-icons/hi2';
import { MdOutlineBuild, MdOutlineCelebration } from 'react-icons/md';
import { GiDiamondRing } from 'react-icons/gi';
import api from '../../services/api';

import "./Home.css";

const categoryIcons = {
  meeting: <HiOutlineUsers />,
  workshop: <MdOutlineBuild />,
  wedding: <GiDiamondRing />,
  party: <MdOutlineCelebration />
};

// const getCategoryIcon = (categoryName) => {
//   return categoryIcons[categoryName?.toLowerCase()] || <MdOutlineBusinessCenter />;
// };


function Featured() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);

  // Fetch venues from database
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const response = await api.getVenues();
        const data = await response.json();
        
        // Ensure data is always an array
        if (Array.isArray(data)) {
          setVenues(data);
        } else {
          console.error('API returned non-array data:', data);
          setVenues([]);
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Fetch favorites for logged-in user
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !token) {
        setFavoriteIds([]);
        return;
      }
      try {
        const response = await api.getFavorites();
        if (response.ok) {
          const data = await response.json();
          setFavoriteIds(data.map(v => v.id));
        }
      } catch (error) {
        setFavoriteIds([]);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, token]);

  const handleVenueClick = (venueId) => {
    navigate(`/room/${venueId}`);
  };

  const handleFavoriteClick = async (e, venueId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Could show login modal here
      return;
    }
    
    // Toggle favorite
    if (favoriteIds.includes(venueId)) {
      // Remove
      await api.removeFavorite(venueId);
    } else {
      // Add
      await api.addFavorite(venueId);
    }
    
    // Re-fetch favorites
    const response = await api.getFavorites();
    if (response.ok) {
      const data = await response.json();
      setFavoriteIds(data.map(v => v.id));
    }
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName?.toLowerCase()] || '🏢';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Convert time string (HH:MM:SS) to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSeeMore = () => {
    navigate('/venues');
  };

  if (loading) {
    return (
      <div className="category-section">
        <div className="loading">Loading featured venues...</div>
      </div>
    );
  }

  // Show only first 6 featured venues
  const featuredVenues = Array.isArray(venues) ? venues.slice(0, 8) : [];

  return (
    <div className="category-section">
      <h2 className="title">Featured Venues in Phnom Penh</h2>
      <hr className="section-divider" />
      <p className="subtitle">
        Explore outstanding venues for rent across Cambodia — ideal for weddings, <br /> parties, meetings, and more. Create unforgettable moments in every event!
      </p>
      
      <div className="venues-grid">
        {featuredVenues.length === 0 ? (
          <div className="no-venues">
            <p>No featured venues available at the moment.</p>
          </div>
        ) : (
          featuredVenues.map((venue) => (
            <div 
              key={venue.id} 
              className="venue-card" 
              onClick={() => handleVenueClick(venue.id)}
              style={{ cursor: 'pointer' }}
            >
              <img 
                src={venue.image || pancakes} 
                alt={venue.name} 
                className="venue-img"
                onError={(e) => {
                  e.target.src = pancakes;
                }}
              />
              <div className="venue-info">
                <h3 className="venue-name">
                  {venue.name}
                  {(venue.openHour || venue.closeHour) && (
                    <span className="venue-hours">
                      {venue.openHour && formatTime(venue.openHour)}
                      {venue.openHour && venue.closeHour && ' - '}
                      {venue.closeHour && formatTime(venue.closeHour)}
                    </span>
                  )}
                </h3>
                <p className="venue-location">{venue.location}</p>
                <p className="venue-capacity"><HiOutlineUsers style={{marginRight: '4px'}} /> {venue.capacity} guests</p>
                <p className="venue-price">{formatPrice(venue.price)} <span className="per-day-text">(per day)</span></p>
                <div className="venue-footer">
                  <span 
                    className={`like${favoriteIds.includes(venue.id) ? ' liked' : ''}`}
                    onClick={e => handleFavoriteClick(e, venue.id)}
                    title={isAuthenticated ? (favoriteIds.includes(venue.id) ? 'Remove from favorites' : 'Add to favorites') : 'Login to favorite'}
                  >
                    {favoriteIds.includes(venue.id) ? (
                      <FaHeart className="favorite-icon filled" />
                    ) : (
                      <FaRegHeart className="favorite-icon" />
                    )}
                  </span>
                  {venue.categories && venue.categories.length > 0 && (
                    <span className="venue-categories">
                      {venue.categories.slice(0, 2).map(cat => (
                        <span key={cat} className="category-tag">
                          {getCategoryIcon(cat)} {cat}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {featuredVenues.length > 0 && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={handleSeeMore}>
            <span className="see-more-text">See All Venues</span>
            <span className="see-more-icon">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Featured;