import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import pancakes from '../../assets/image1.png';
import './VenuesList.css';
import { AuthContext } from '../../context/AuthContext';
import SignupPopUp from '../../component/HomePage/SignupPopUp';
import { ABAPayModal } from '../../component/payment';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HiOutlineUsers } from 'react-icons/hi2';
import { MdOutlineBuild, MdOutlineCelebration, MdOutlineBusinessCenter } from 'react-icons/md';
import api from '../../services/api';
import { GiDiamondRing } from 'react-icons/gi';

const categoryIcons = {
  meeting: <HiOutlineUsers />,
  workshop: <MdOutlineBuild />,
  wedding: <GiDiamondRing />,
  party: <MdOutlineCelebration />
};

export default function VenuesList() {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [venuesPerPage] = useState(12);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, token } = useContext(AuthContext);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFavoriteModal, setShowFavoriteModal] = useState(false);

  // Filter and sort states
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [capacityRange, setCapacityRange] = useState([0, 500]);
  const [showFilters, setShowFilters] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getCategories();
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
        const response = await api.getVenues(selectedCategory);
        const data = await response.json();
        setVenues(data);
        setCurrentPage(1); // Reset to first page when category changes
      } catch (error) {
        console.error('Error fetching venues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [selectedCategory]);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...venues];

    // Apply category filter (frontend, in case backend returns all venues)
    if (selectedCategory) {
      filtered = filtered.filter(venue =>
        Array.isArray(venue.categories) &&
        venue.categories.map(c => c.toLowerCase()).includes(selectedCategory.toLowerCase())
      );
    }

    // Apply price filter
    filtered = filtered.filter(venue => 
      venue.price >= priceRange[0] && venue.price <= priceRange[1]
    );

    // Apply capacity filter
    filtered = filtered.filter(venue => 
      venue.capacity >= capacityRange[0] && venue.capacity <= capacityRange[1]
    );

    // Apply sorting
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
          aValue = a.location.toLowerCase();
          bValue = b.location.toLowerCase();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredVenues(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [venues, sortBy, sortOrder, priceRange, capacityRange, selectedCategory]);

  // Fetch favorites for logged-in user
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
      await api.removeFavorite(venueId);
    } else {
      await api.addFavorite(venueId);
    }
    fetchFavorites();
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handleVenueClick = (venueId) => {
    navigate(`/room/${venueId}`);
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

  // Pagination logic
  const indexOfLastVenue = currentPage * venuesPerPage;
  const indexOfFirstVenue = indexOfLastVenue - venuesPerPage;
  const currentVenues = filteredVenues.slice(indexOfFirstVenue, indexOfLastVenue);
  const totalPages = Math.ceil(filteredVenues.length / venuesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setCapacityRange([0, 500]);
    setSortBy('name');
    setSortOrder('asc');
  };

  if (loading && venues.length === 0) {
    return (
      <div className="venues-list-container">
        <div className="loading">Loading venues...</div>
      </div>
    );
  }

  return (
    <div className="venues-list-container">
      <SignupPopUp open={showFavoriteModal} onClose={() => setShowFavoriteModal(false)} />
      <div className="venues-header">
        <h1>{selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Venues` : 'All Venues'}</h1>
        <p>Discover the perfect venue for your next event</p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="filter-sort-bar">
        <div className="filter-sort-left">
          <div className="results-count">
            <span>{filteredVenues.length} venues found</span>
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

      <div className="venues-grid">
        {filteredVenues.length === 0 ? (
          <div className="no-venues">
            <p>No venues found matching your criteria.</p>
            <button className="reset-filters-btn" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          currentVenues.map((venue) => (
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
                <p className="venue-capacity"><HiOutlineUsers style={{marginRight: '4px'}} /> {venue.capacity} guests</p>
                <p className="venue-price">{formatPrice(venue.price)}</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                className={`page-number ${currentPage === number ? 'active' : ''}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}
          </div>

          <button 
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
} 