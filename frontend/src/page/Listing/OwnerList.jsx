import React, { useState, useEffect } from 'react';

function OwnerListings() {
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
    capacity: '',
    price: '',
    open_hour: '',
    close_hour: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Google Maps integration
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const owner_id = 1; // Replace with actual owner ID from auth context

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleMaps;
      document.head.appendChild(script);
    } else {
      initializeGoogleMaps();
    }
  }, []);

  const initializeGoogleMaps = () => {
    // Initialize autocomplete when the form is shown
    if (showAddForm && window.google) {
      setTimeout(() => {
        const input = document.getElementById('location-input');
        if (input && !autocomplete) {
          const newAutocomplete = new window.google.maps.places.Autocomplete(input, {
            types: ['establishment', 'geocode'],
            componentRestrictions: { country: 'kh' } // Restrict to Cambodia, change as needed
          });
          
          newAutocomplete.addListener('place_changed', () => {
            const place = newAutocomplete.getPlace();
            if (place.formatted_address) {
              setFormData(prev => ({
                ...prev,
                location: place.formatted_address
              }));
            }
          });
          
          setAutocomplete(newAutocomplete);
        }
      }, 100);
    }
  };

  // Reinitialize Google Maps when form opens
  useEffect(() => {
    if (showAddForm) {
      initializeGoogleMaps();
    }
  }, [showAddForm]);

  // Fetch categories and listings on component mount
  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories');
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/listings?owner_id=${owner_id}`);
      const data = await response.json();
      setListings(data.listings || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }

    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    setImagePreview(previews);
  };

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(imagePreview[index].url);
    
    setSelectedImages(newImages);
    setImagePreview(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation: At least one category must be selected
    if (selectedCategories.length === 0) {
      alert('Please select at least one category for your venue');
      return;
    }

    setSubmitLoading(true);

    try {
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      formDataToSend.append('owner_id', owner_id);
      formDataToSend.append('categories', JSON.stringify(selectedCategories));
      
      // Add images
      selectedImages.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      const url = editingListing 
        ? `http://localhost:5000/api/listings/${editingListing.id}?owner_id=${owner_id}`
        : `http://localhost:5000/api/listings`;
      
      const method = editingListing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend // Don't set Content-Type header, let browser set it
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        await fetchListings();
        setShowAddForm(false);
        setEditingListing(null);
        resetForm();
        alert('Venue saved successfully!');
      } else {
        const error = await response.json();
        console.error('Error:', error);
        alert('Error saving venue: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Error saving venue. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({
      name: listing.name,
      description: listing.description,
      location: listing.location,
      capacity: listing.capacity.toString(),
      price: listing.price.toString(),
      open_hour: listing.openHour,
      close_hour: listing.closeHour
    });
    setSelectedCategories(listing.categories?.map(cat => cat.id) || []);
    setShowAddForm(true);
    
    // Reset images for editing (user needs to re-upload)
    setSelectedImages([]);
    setImagePreview([]);
  };

  const handleDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete this venue? This will also delete all associated images and bookings.')) {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/${listingId}?owner_id=${owner_id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchListings();
          alert('Venue deleted successfully!');
        } else {
          const error = await response.json();
          alert('Error deleting venue: ' + (error.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Error deleting venue. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      capacity: '',
      price: '',
      open_hour: '',
      close_hour: ''
    });
    setSelectedCategories([]);
    setSelectedImages([]);
    setImagePreview([]);
    
    // Cleanup preview URLs
    imagePreview.forEach(preview => {
      URL.revokeObjectURL(preview.url);
    });

    // Reset Google Maps autocomplete
    if (autocomplete) {
      setAutocomplete(null);
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingListing(null);
    resetForm();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
        Loading your venues...
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#222a3a', fontSize: '2.2rem', fontWeight: '600' }}>My Venue Listings</h1>
        <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '24px' }}>Manage your venue listings</p>
        <button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm}
          style={{
            background: '#001d7d',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: showAddForm ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            opacity: showAddForm ? 0.6 : 1
          }}
        >
          + Add New Venue
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #e5e5e5',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ marginBottom: '24px', color: '#1a1a75' }}>
            {editingListing ? 'Edit Venue' : 'Add New Venue'}
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Basic Information */}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '1.1rem' }}>Basic Information</h3>
              
              {/* Venue Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Venue Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Grand Ballroom, Conference Center"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  required
                  placeholder="Describe your venue, amenities, and what makes it special..."
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '6px', 
                    resize: 'vertical',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Location with Google Maps */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Venue Address *</label>
                <input
                  type="text"
                  id="location-input"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Start typing your address..."
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
                <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                  <i className="fas fa-map-marker-alt"></i> Start typing for address suggestions
                </small>
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '1.1rem' }}>Capacity & Pricing</h3>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Maximum Capacity *</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    min="1"
                    max="1000"
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
                  <small style={{ color: '#666' }}>Number of guests the venue can accommodate</small>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price per Hour ($) *</label>
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
                  <small style={{ color: '#666' }}>Hourly rental rate</small>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '1.1rem' }}>Operating Hours</h3>
              
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Opening Time *</label>
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Closing Time *</label>
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
            </div>

            {/* Categories - REQUIRED */}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '1.1rem' }}>
                Categories * <span style={{ color: '#e74c3c', fontSize: '0.9rem' }}>(Select at least one)</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                {categories.map((category) => (
                  <label key={category.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    padding: '10px 16px', 
                    border: '2px solid #e5e5e5', 
                    borderRadius: '20px',
                    cursor: 'pointer',
                    backgroundColor: selectedCategories.includes(category.id) ? '#e3f2fd' : 'white',
                    borderColor: selectedCategories.includes(category.id) ? '#1976d2' : '#e5e5e5',
                    fontSize: '0.95rem'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      style={{ marginRight: '8px' }}
                    />
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </label>
                ))}
              </div>
              <small style={{ color: '#666' }}>Select all categories that apply to your venue</small>
            </div>

            {/* Images Upload */}
            <div>
              <h3 style={{ marginBottom: '16px', color: '#333', fontSize: '1.1rem' }}>Venue Photos</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Upload Images (Max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px dashed #e5e5e5', 
                    borderRadius: '6px',
                    fontSize: '1rem',
                    backgroundColor: '#fafafa'
                  }}
                />
                <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
                  Supported formats: JPG, PNG, GIF. Max size: 5MB per image.
                </small>
              </div>

              {/* Image Preview */}
              {imagePreview.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: '12px', color: '#333' }}>Image Preview:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                    {imagePreview.map((preview, index) => (
                      <div key={index} style={{ position: 'relative', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(255, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ×
                        </button>
                        <div style={{ padding: '4px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '10px', textAlign: 'center' }}>
                          {preview.name.length > 15 ? preview.name.substring(0, 15) + '...' : preview.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                onClick={cancelForm}
                disabled={submitLoading}
                style={{
                  background: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #ddd',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={submitLoading}
                style={{
                  background: submitLoading ? '#ccc' : '#28a745',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: submitLoading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {submitLoading && <span>⟳</span>}
                {submitLoading ? 'Saving...' : (editingListing ? 'Update Venue' : 'Add Venue')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Venues List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '24px' }}>
        {listings.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '64px 32px',
            background: 'white',
            borderRadius: '12px',
            border: '1px solid #e5e5e5'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '24px', opacity: 0.3 }}>🏢</div>
            <h3 style={{ fontSize: '1.5rem', color: '#333', marginBottom: '12px' }}>No venues yet</h3>
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '32px' }}>
              You haven't created any venue listings yet.
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{
                background: '#001d7d',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1.1rem',
                fontWeight: '600'
              }}
            >
              Add Your First Venue
            </button>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e5e5',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              {/* Venue Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#1a1a75' }}>{listing.name}</h3>
              </div>
              
              {/* Venue Image */}
              {listing.images && listing.images.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <img
                    src={listing.images[0]}
                    alt={listing.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #e5e5e5'
                    }}
                  />
                  {listing.images.length > 1 && (
                    <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                      +{listing.images.length - 1} more photos
                    </small>
                  )}
                </div>
              )}
              
              {/* Venue Details */}
              <div style={{ marginBottom: '16px', color: '#555' }}>
                <p style={{ margin: '8px 0' }}><strong>Location:</strong> {listing.location}</p>
                <p style={{ margin: '8px 0' }}><strong>Capacity:</strong> {listing.capacity} guests</p>
                <p style={{ margin: '8px 0' }}><strong>Price:</strong> ${listing.price}/hour</p>
                <p style={{ margin: '8px 0' }}><strong>Hours:</strong> {listing.openHour} - {listing.closeHour}</p>
                {listing.categories && listing.categories.length > 0 && (
                  <div style={{ margin: '8px 0' }}>
                    <strong>Categories:</strong> 
                    <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {listing.categories.map(cat => (
                        <span key={cat.id} style={{
                          background: '#f0f4ff',
                          color: '#1976d2',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}>
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <p style={{ margin: '8px 0', fontSize: '0.9rem', color: '#777' }}>
                  <strong>Description:</strong> {listing.description.length > 100 
                    ? listing.description.substring(0, 100) + '...' 
                    : listing.description}
                </p>
              </div>
              
              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #eee'
              }}>
                <button 
                  onClick={() => handleEdit(listing)}
                  disabled={showAddForm || submitLoading}
                  style={{
                    background: (showAddForm || submitLoading) ? '#ccc' : '#007bff',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: (showAddForm || submitLoading) ? 'not-allowed' : 'pointer',
                    flex: 1,
                    fontSize: '0.95rem'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(listing.id)}
                  disabled={showAddForm || submitLoading}
                  style={{
                    background: (showAddForm || submitLoading) ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: (showAddForm || submitLoading) ? 'not-allowed' : 'pointer',
                    flex: 1,
                    fontSize: '0.95rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default OwnerListings;