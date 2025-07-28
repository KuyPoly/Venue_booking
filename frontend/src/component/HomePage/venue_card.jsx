import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import pancakes from '../../assets/image1.png'; // Fallback image
import { AuthContext } from '../../context/AuthContext';
import SignupPopUp from './SignupPopUp';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HiOutlineUsers } from 'react-icons/hi2';
import { MdOutlineBuild, MdOutlineCelebration, MdOutlineBusinessCenter } from 'react-icons/md';
import { GiDiamondRing } from 'react-icons/gi';

const categoryIcons = {
  meeting: <HiOutlineUsers />,
  workshop: <MdOutlineBuild />,
  wedding: <GiDiamondRing />,
  party: <MdOutlineCelebration />
};

export default function CategorySection(props) {
  // Default to false if not provided
  const hideCategories = props.hideCategories === true;
  const [categories, setCategories] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, token } = useContext(AuthContext);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch venues
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const url = selectedCategory 
          ? `http://localhost:5000/venues?category=${selectedCategory}`
          : 'http://localhost:5000/venues';
        console.log('Homepage: Fetching venues from:', url); // Debug log
        const response = await fetch(url);
        console.log('Homepage: Response status:', response.status); // Debug log
        const data = await response.json();
        console.log('Homepage: Response data:', data); // Debug log
        console.log('Homepage: Number of venues received:', data?.length || 0); // Debug log
        setVenues(data);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setVenues([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, [selectedCategory]);

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

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };



  const handleVenueClick = (venueId) => {
    navigate(`/room/${venueId}`);
  };

  const handleFavoriteClick = async (e, venueId) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowFavoriteModal(true);
      return;
    }
    // Toggle favorite
    if (favoriteIds.includes(venueId)) {
      // Remove
      await fetch(`http://localhost:5000/favorites/${venueId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } else {
      // Add
      await fetch('http://localhost:5000/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hallId: venueId })
      });
    }
    // Always re-fetch after change
    fetchFavorites();
  };

  const handleSeeMore = () => {
    const categoryParam = selectedCategory ? `?category=${selectedCategory}` : '';
    navigate(`/venues${categoryParam}`);
  };

  const handleCategorySeeMore = (categoryName, event) => {
    event.stopPropagation();
    navigate(`/venues?category=${categoryName}`);
  };

  const getCategoryIcon = (categoryName) => {
    return categoryIcons[categoryName.toLowerCase()] || <MdOutlineBusinessCenter />;
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

  if (loading && venues.length === 0) {
    return (
      <div className="category-section">
        <div className="loading">Loading venues...</div>
      </div>
    );
  }

  if (props.venue) {
    const venue = props.venue;
    return (
      <div 
        key={venue.id} 
        className="venue-card" 
        onClick={() => handleVenueClick(venue.id)}
        style={{ cursor: 'pointer' }}
      >
        <img 
          src={venue.image || pancakes} 
          alt={venue.type} 
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
          <p className="venue-type">{venue.type}</p>
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
            {(!hideCategories && venue.categories && venue.categories.length > 0) && (
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
    );
  }

  // Show only first 8 venues (2 rows x 4 columns)
  const venuesToShow = venues.slice(0, 4);
  const hasMoreVenues = venues.length > 4;

  return (
    <div className="category-section">
      <SignupPopUp open={showFavoriteModal} onClose={() => setShowFavoriteModal(false)} />
      {!hideCategories && (
        <div className="categories">
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.name)}
            >
              <span className="category-icon">{getCategoryIcon(category.name)}</span>
              <p>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</p>
              <button 
                className="category-see-more-btn"
                onClick={(e) => handleCategorySeeMore(category.name, e)}
              >
                See More
              </button>
            </div>
          ))}
        </div>
      )}



      <div className="venues-grid">
        {venues.length === 0 ? (
          <div className="no-venues">
            <p>No venues found for this category.</p>
          </div>
        ) : (
          <>
            {venuesToShow.map((venue) => (
              <div 
                key={venue.id} 
                className="venue-card" 
                onClick={() => handleVenueClick(venue.id)}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={venue.image || pancakes} 
                  alt={venue.type} 
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
                  <p className="venue-type">{venue.type}</p>
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
                    {(!hideCategories && venue.categories && venue.categories.length > 0) && (
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
            ))}
          </>
        )}
      </div>

      {/* See More Button */}
      {hasMoreVenues && (
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
