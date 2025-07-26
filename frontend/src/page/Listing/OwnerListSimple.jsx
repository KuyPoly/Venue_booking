import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './OwnerList.css';

// Simple version without Google Maps for testing
function OwnerListingsSimple() {
  const { user } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    address: '',
    capacity: '',
    price: '',
    open_hour: '',
    close_hour: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const owner_id = user?.id;

  // Debug info
  useEffect(() => {
    console.log('=== SIMPLE DEBUG INFO ===');
    console.log('User from auth context:', user);
    console.log('User ID (owner_id):', user?.id);
    console.log('User role:', user?.role);
    console.log('Owner ID being used:', owner_id);
    console.log('=================');
  }, [user, owner_id]);

  // Check user permissions
  useEffect(() => {
    if (!user) {
      alert('Please log in to access this page');
      window.location.href = '/';
      return;
    }
    
    if (user.role !== 'owner') {
      alert('Access denied. Only venue owners can access this page.');
      window.location.href = '/';
      return;
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="owner-listings-container">
      <div className="owner-header">
        <h1>My Venues</h1>
        <p>Manage your venue listings and track bookings</p>
        
        <button 
          className="add-venue-btn"
          onClick={() => setShowAddForm(true)}
          disabled={submitLoading}
        >
          + Add New Venue
        </button>
      </div>

      {/* Simple form without Google Maps */}
      {showAddForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '12px', 
            width: '90%', 
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>Add New Venue (Simple Version)</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted:', formData);
              alert('Simple form submitted! Check console for data.');
            }}>
              
              {/* Basic Info */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Venue Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter venue name..."
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe your venue..."
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Location */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Address *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter venue address..."
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                  Google Maps integration will be added once API issues are resolved
                </small>
              </div>

              {/* Capacity & Price */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Capacity *
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    required
                    placeholder="e.g., 150"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '2px solid #e5e5e5', 
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Price per Day ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    placeholder="e.g., 250.00"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '2px solid #e5e5e5', 
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Operating Hours */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Opening Time *
                  </label>
                  <input
                    type="time"
                    name="open_hour"
                    value={formData.open_hour}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '2px solid #e5e5e5', 
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                    Closing Time *
                  </label>
                  <input
                    type="time"
                    name="close_hour"
                    value={formData.close_hour}
                    onChange={handleInputChange}
                    required
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '2px solid #e5e5e5', 
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end', 
                marginTop: '32px',
                paddingTop: '24px',
                borderTop: '1px solid #e5e5e5'
              }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #ddd',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  Add Venue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listings display would go here */}
      <div style={{ marginTop: '20px' }}>
        <p>Your venues will be displayed here once loaded.</p>
      </div>
    </div>
  );
}

export default OwnerListingsSimple;
