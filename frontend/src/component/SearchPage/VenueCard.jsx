import React from 'react';
import pancakes from '../../assets/image1.png';
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

const getCategoryIcon = (categoryName) => categoryIcons[categoryName?.toLowerCase()] || <MdOutlineBusinessCenter />;

const formatPrice = (price) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(price);

const formatTime = (timeString) => {
  if (!timeString) return '';
  // Convert time string (HH:MM:SS) to 12-hour format
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const VenueCard = ({ venue, onClick, onFavorite, isFavorite, isAuthenticated }) => (
  <div className="venue-card" onClick={onClick} style={{ cursor: 'pointer' }}>
    <img
      src={venue.image || pancakes}
      alt={venue.type}
      className="venue-img"
      onError={e => { e.target.src = pancakes; }}
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