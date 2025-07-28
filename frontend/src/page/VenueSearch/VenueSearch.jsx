import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VenueCard from '../../component/HomePage/venue_card';
import Map from '../../component/SearchPage/Map';
import GoogleMapsTestComponent from '../../components/GoogleMapsTestComponent';
import api from '../../services/api';
import './VenueSearch.css';

const VenueSearch = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const location = params.get('location') || '';
  const guests = params.get('guests') || '';
  const budget = params.get('budget') || '';

  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    location,
    guests,
    budget,
    name: '',
    type: ''
  });

  useEffect(() => {
    fetchVenues();
    // eslint-disable-next-line
  }, [filters.location, filters.guests, filters.budget, filters.name, filters.type]);

  const fetchVenues = async () => {
    // Fetch all venues from backend
    const res = await api.getVenues();
    if (res.ok) {
      const data = await res.json();
      // Filter venues on frontend
      const filtered = data.filter(venue => {
        const matchesName = filters.name ? venue.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
        const matchesLocation = filters.location ? venue.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
        const matchesType = filters.type
          ? venue.categories.some(cat => cat.toLowerCase() === filters.type.toLowerCase())
          : true;
        const matchesGuests = filters.guests ? Number(venue.capacity) >= Number(filters.guests) : true;
        const matchesBudget = filters.budget ? Number(venue.price) <= Number(filters.budget) : true;
        return matchesName && matchesLocation && matchesType && matchesGuests && matchesBudget;
      });
      setVenues(filtered);
    } else {
      console.error('Failed to fetch venues:', res.status);
      setVenues([]);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVenues();
  };

return (
  <div className="venue-search-container">
    <div className="venue-search-left">
      <form className="venue-search-form" onSubmit={handleSearch}>
        <div className="venue-search-form-col">
          <div className="venue-search-form-row">
            <input name="name" placeholder="Search by Name" value={filters.name} onChange={handleChange} />
          </div>
          <div className="venue-search-form-row">
            <input name="location" placeholder="Target Location" value={filters.location} onChange={handleChange} />
          </div>
          <div className="venue-search-form-row">
            <select name="type" value={filters.type} onChange={handleChange}>
              <option value="">Venue Type</option>
              <option value="meeting">Meeting</option>
              <option value="party">Party</option>
              <option value="wedding">Wedding</option>
              <option value="workshop">Workshop</option>
            </select>
          </div>
          <div className="venue-search-form-row-2col">
            <select name="guests" value={filters.guests} onChange={handleChange}>
              <option value="">Maximum Guest Capacity</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
            <select name="budget" value={filters.budget} onChange={handleChange}>
              <option value="">Price</option>
              <option value="100">$100</option>
              <option value="500">$500</option>
              <option value="1000">$1000</option>
              <option value="5000">$5000</option>
              <option value="10000">$10,000+</option>
            </select>
          </div>
        </div>
      </form>
      <h5>Venue Search Results</h5>
      <div className="venue-cards-grid">
        {venues.length === 0 ? (
          <div className="no-venues">
            <img src={require('../../assets/image1.png')} alt="No venues found" />
            <p>No venues found. Try adjusting your search filters!</p>
          </div>
        ) : (
          venues.map(venue => (
            <VenueCard key={venue.id} venue={venue} hideCategories />
          ))
        )}
      </div>
    </div>
    <div className="venue-search-right">
      <GoogleMapsTestComponent />
    </div>
  </div>
);
};

export default VenueSearch;
