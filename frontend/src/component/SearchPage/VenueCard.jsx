import React from 'react';
import pancakes from '../../assets/image1.png';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const categoryIcons = {
  meeting: '👥',
  workshop: '🛠️',
  wedding: '💍',
  party: '🎉'
};

const getCategoryIcon = (categoryName) => categoryIcons[categoryName?.toLowerCase()] || '🏢';

const formatPrice = (price) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price);

const VenueCard = ({ venue, onClick, onFavorite, isFavorite, isAuthenticated }) => (
  <div className="venue-card" onClick={onClick} style={{ cursor: 'pointer' }}>
    <img
      src={venue.image || pancakes}
      alt={venue.type}
      className="venue-img"
      onError={e => { e.target.src = pancakes; }}
    />
    <div className="venue-info">
      <h3 className="venue-name">{venue.name}</h3>
      <p className="venue-location">{venue.location}</p>
      <p className="venue-type">{venue.type}</p>
      <p className="venue-capacity">👥 {venue.capacity} guests</p>
      <p className="venue-price">{formatPrice(venue.price)}</p>
      <div className="venue-footer">
        <span
          className={`like${isFavorite ? ' liked' : ''}`}
          onClick={onFavorite}
          title={isAuthenticated ? (isFavorite ? 'Remove from favorites' : 'Add to favorites') : 'Login to favorite'}
        >
          {isFavorite ? <FaHeart className="favorite-icon filled" /> : <FaRegHeart className="favorite-icon" />}
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
);

export default VenueCard;