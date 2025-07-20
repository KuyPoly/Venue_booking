import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import pancakes from '../../assets/image1.png';
import './Favorites.css';

const categoryIcons = {
  meeting: '👥',
  workshop: '🛠️',
  wedding: '💍',
  party: '🎉'
};

export default function Favorites() {
  const { isAuthenticated, token, loading } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [favLoading, setFavLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [capacityRange, setCapacityRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated || !token) {
        setFavorites([]);
        setFavLoading(false);
        return;
      }
      setFavLoading(true);
      try {
        const response = await fetch('http://localhost:5000/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        setFavorites([]);
      } finally {
        setFavLoading(false);
      }
    };
    fetchFavorites();
  }, [isAuthenticated, token]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Filtering and sorting logic
  useEffect(() => {
    let filtered = [...favorites];
    if (selectedCategory) {
      filtered = filtered.filter(venue =>
        Array.isArray(venue.categories) &&
        venue.categories.map(c => c.toLowerCase()).includes(selectedCategory.toLowerCase())
      );
    }
    filtered = filtered.filter(venue =>
      venue.price >= priceRange[0] && venue.price <= priceRange[1]
    );
    filtered = filtered.filter(venue =>
      venue.capacity >= capacityRange[0] && venue.capacity <= capacityRange[1]
    );
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'capacity':
          aValue = a.capacity;
          bValue = b.capacity;
          break;
        case 'name':
        default:
          aValue = a.name ? a.name.toLowerCase() : '';
          bValue = b.name ? b.name.toLowerCase() : '';
          break;
      }
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    setFilteredFavorites(filtered);
  }, [favorites, sortBy, sortOrder, priceRange, capacityRange, selectedCategory]);

  const handleVenueClick = (venueId) => {
    navigate(`/room/${venueId}`);
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

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setCapacityRange([0, 500]);
    setSortBy('name');
    setSortOrder('asc');
    setSelectedCategory(null);
  };

  if (loading || favLoading) {
    return <div className="favorites-container"><div className="loading">Loading favorites...</div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>Your Favorites</h1>
        </div>
        <div className="not-logged-in-message">
          <p>Please log in to view your favorite venues.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>Your Favorites</h1>
        <p>All the venues you love in one place</p>
      </div>
      {/* Filter and Sort Bar */}
      <div className="filter-sort-bar">
        <div className="filter-sort-left">
          <div className="results-count">
            <span>{filteredFavorites.length} venues found</span>
          </div>
        </div>
        <div className="filter-sort-right">
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span>Filters</span>
            <span className={`filter-icon ${showFilters ? 'active' : ''}`}>▼</span>
          </button>
          <div className="sort-dropdown">
            <select 
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="sort-select"
            >
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="capacity-asc">Capacity: Small to Large</option>
              <option value="capacity-desc">Capacity: Large to Small</option>
            </select>
          </div>
        </div>
      </div>
      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Price Range</label>
            <div className="range-slider">
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="range-input"
              />
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="range-input"
              />
            </div>
            <div className="range-values">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
          <div className="filter-group">
            <label>Capacity Range</label>
            <div className="range-slider">
              <input
                type="range"
                min="0"
                max="500"
                value={capacityRange[0]}
                onChange={(e) => setCapacityRange([parseInt(e.target.value), capacityRange[1]])}
                className="range-input"
              />
              <input
                type="range"
                min="0"
                max="500"
                value={capacityRange[1]}
                onChange={(e) => setCapacityRange([capacityRange[0], parseInt(e.target.value)])}
                className="range-input"
              />
            </div>
            <div className="range-values">
              <span>{capacityRange[0]} guests</span>
              <span>{capacityRange[1]} guests</span>
            </div>
          </div>
          <div className="filter-group">
            <label>Category</label>
            <div className="categories">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className={`category-item ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === category.name ? null : category.name)}
                >
                  <span className="category-icon">{getCategoryIcon(category.name)}</span>
                  <p>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="reset-filters-btn" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      )}
      {filteredFavorites.length === 0 ? (
        <div className="no-favorites">
          <p>No favorite venues match your criteria.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredFavorites.map((venue) => (
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
                <h3 className="venue-name">{venue.name}</h3>
                <p className="venue-location">{venue.location}</p>
                <p className="venue-type">{venue.type}</p>
                <p className="venue-capacity">👥 {venue.capacity} guests</p>
                <p className="venue-price">{formatPrice(venue.price)}</p>
                <div className="venue-footer">
                  <span className='like liked' title="Favorite">❤️</span>
                  {venue.categories && venue.categories.length > 0 && (
                    <span className="venue-categories">
                      {venue.categories.slice(0, 2).map(cat => (
                        <span key={cat} className="category-tag">
                          {cat}
                        </span>
                      ))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 