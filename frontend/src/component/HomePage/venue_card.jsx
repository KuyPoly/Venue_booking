import React from 'react';
import pancakes from '../../assets/image1.png'; // Use placeholder image


const categories = [
  { icon: '👥', label: 'Meeting' },
  { icon: '🛠️', label: 'Work Shop' },
  { icon: '💍', label: 'Weeding' },
  { icon: '🎉', label: 'Party' }
];

const venues = [
  { id: 1, location: 'Phnom Penh', guests: 500, image: pancakes },
  { id: 2, location: 'Phnom Penh', guests: 500, image: pancakes },
  { id: 3, location: 'Phnom Penh', guests: 500, image: pancakes },
  { id: 4, location: 'Phnom Penh', guests: 500, image: pancakes },
];

export default function CategorySection() {
  return (
    <div className="category-section">
      <div className="categories">
        {categories.map((cat, i) => (
          <div key={i} className="category-item">
            <span className="category-icon">{cat.icon}</span>
            <p>{cat.label}</p>
          </div>
        ))}
      </div>

      <div className="venues">
        {venues.map((venue) => (
          <div key={venue.id} className="venue-card" onClick={() => window.location.href = `/room/${venue.id}` } style={{ cursor: 'pointer' }}>
            <img src={venue.image} alt="venue" className="venue-img" />
            <div className="venue-info">
              <h4>{venue.location}</h4>
              <p>👥 {venue.guests}</p>
              <div className="venue-footer">
                <span>♡</span>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>☆</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
