import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Add this import
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { sendHallAddedNotification } from '../../services/emailService';
import api from '../../services/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  border: '1px solid #ddd'
};

const defaultCenter = {
  lat: 11.5564, // Phnom Penh, Cambodia
  lng: 104.9282
};


function OwnerListings() {
  const { user } = useContext(AuthContext); // Get user from auth context
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
    close_hour: '',
    latitude: '',
    longitude: '',
    address: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Google Maps integration
  const [map, setMap] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  // Add debugging for form data changes
  useEffect(() => {
    console.log('FormData changed:', {
      capacity: formData.capacity,
      price: formData.price,
      name: formData.name,
      location: formData.location
    });
  }, [formData.capacity, formData.price, formData.name, formData.location]);

  // Get owner_id from authenticated user
  const owner_id = user?.id; // Use actual user ID from auth context

  // Add debugging to check user and owner_id
  useEffect(() => {
    console.log('=== DEBUG INFO ===');
    console.log('User from auth context:', user);
    console.log('User ID (owner_id):', user?.id);
    console.log('User role:', user?.role);
    console.log('Owner ID being used:', owner_id);
    console.log('=================');
  }, [user, owner_id]);

  // Add a check to ensure user is logged in and is an owner
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
  }, []);

  // Fetch listings when owner_id becomes available
  useEffect(() => {
    if (owner_id) {
      fetchListings();
    }
  }, [owner_id]);

  const fetchCategories = async () => {
    try {
      const response = await api.getCategories();
      const data = await response.json();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchListings = async () => {
    if (!owner_id) {
      console.log('No owner_id available, cannot fetch listings');
      setListings([]);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching listings for owner_id:', owner_id); // Debug log
      const response = await api.getOwnerListings();
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', response.status, errorText);
        setListings([]);
        return;
      }
      
      const data = await response.json();
      console.log('Response data:', data); // Debug log
      setListings(data.listings || []);
      console.log('Set listings to:', data.listings || []); // Debug log
    } catch (error) {
      console.error('Error fetching listings:', error);
      setListings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Simply use the raw input value - let HTML5 input validation handle number constraints
    console.log(`Updating ${name} from "${formData[name]}" to "${value}"`);
    
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

  // Google Maps Event Handlers
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const location = { lat, lng };
    
    setSelectedLocation(location);
    // Reverse geocode to get address
    if (window.google && window.google.maps) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
            address: results[0].formatted_address,
            location: results[0].formatted_address
          }));
        } else {
          // If reverse geocoding fails, still update coordinates
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString()
          }));
        }
      });
    } else {
      // If no Google Maps geocoder, just update coordinates
      setFormData(prev => ({
        ...prev,
        latitude: lat.toString(),
        longitude: lng.toString()
      }));
    }
  };

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const location = { lat, lng };
        
        setSelectedLocation(location);
        setMapCenter(location);
        setFormData(prev => ({
          ...prev,
          location: place.formatted_address || place.name,
          address: place.formatted_address || place.name,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));
      }
    }
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
        ? `${api.baseURL}/api/listings/${editingListing.id}`
        : `${api.baseURL}/api/listings`;
      
      const method = editingListing ? 'PUT' : 'POST';
      
      // Get auth headers
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(url, {
        method,
        headers,
        body: formDataToSend // Don't set Content-Type header, let browser set it
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Success:', result);
        
        // If creating a new venue (not editing), send email notification
        if (!editingListing && result.listing && result.owner) {
          try {
            console.log('Sending email notification for new venue...');
            await sendHallAddedNotification(result.listing, result.owner);
            console.log('Email notification sent successfully!');
          } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Don't block the success flow if email fails
            alert('Venue saved successfully! However, email notification could not be sent.');
          }
        }
        
        await fetchListings();
        setShowAddForm(false);
        setEditingListing(null);
        resetForm();
        
        if (!editingListing) {
          alert('Venue added successfully! An email notification has been sent to you.');
        } else {
          alert('Venue updated successfully!');
        }
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
    if (window.confirm('Are you sure you want to delete this venue? This will also delete all associated images, bookings, and reservations.')) {
      try {
        console.log('Attempting to delete listing:', listingId);
        const response = await api.deleteListing(listingId);
        console.log('Delete response status:', response.status);

        if (response.ok) {
          await fetchListings();
          alert('Venue deleted successfully! All associated data has been removed.');
        } else {
          let errorMessage = 'Unknown error';
          try {
            const error = await response.json();
            errorMessage = error.error || error.message || `Server error: ${response.status}`;
            if (error.details) {
              errorMessage += `\nDetails: ${error.details}`;
            }
          } catch (jsonError) {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}`;
          }
          console.error('Delete API error:', errorMessage);
          
          // Provide specific guidance for foreign key errors
          if (errorMessage.toLowerCase().includes('foreign key') || 
              errorMessage.toLowerCase().includes('constraint') ||
              errorMessage.toLowerCase().includes('cannot delete')) {
            alert('Unable to delete venue: This venue has active bookings or reservations that must be cancelled first. Please contact support if you need assistance.');
          } else {
            alert('Error deleting venue: ' + errorMessage);
          }
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
        if (error.message.toLowerCase().includes('fetch')) {
          alert('Network error: Please check your internet connection and try again.');
        } else {
          alert('Error deleting venue. Please check your connection and try again.');
        }
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
                
                {/* Address Search Input */}
                {isLoaded ? (
                  <Autocomplete
                    onLoad={setAutocomplete}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      placeholder="Search for venue address..."
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        border: '2px solid #e5e5e5', 
                        borderRadius: '6px',
                        fontSize: '1rem'
                      }}
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter complete venue address..."
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      border: '2px solid #e5e5e5', 
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                )}

                {/* Google Maps */}
                <div style={{ marginTop: '12px' }}>
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={selectedLocation || mapCenter}
                      zoom={15}
                      onClick={handleMapClick}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false
                      }}
                    >
                      {selectedLocation && (
                        <Marker
                          position={selectedLocation}
                          draggable={true}
                          onDragEnd={(event) => {
                            const lat = event.latLng.lat();
                            const lng = event.latLng.lng();
                            const location = { lat, lng };
                            
                            setSelectedLocation(location);
                            
                            // Reverse geocode
                            if (window.google && window.google.maps) {
                              const geocoder = new window.google.maps.Geocoder();
                              geocoder.geocode({ location }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                  setFormData(prev => ({
                                    ...prev,
                                    latitude: lat.toString(),
                                    longitude: lng.toString(),
                                    address: results[0].formatted_address,
                                    location: results[0].formatted_address
                                  }));
                                } else {
                                  // If reverse geocoding fails, still update coordinates
                                  setFormData(prev => ({
                                    ...prev,
                                    latitude: lat.toString(),
                                    longitude: lng.toString()
                                  }));
                                }
                              });
                            } else {
                              // If no Google Maps geocoder, just update coordinates
                              setFormData(prev => ({
                                ...prev,
                                latitude: lat.toString(),
                                longitude: lng.toString()
                              }));
                            }
                          }}
                        />
                      )}
                    </GoogleMap>
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '300px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '2px dashed #ddd',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9',
                      color: '#666'
                    }}>
                      Loading Google Maps...
                    </div>
                  )}
                </div>

                <small style={{ color: '#666', marginTop: '8px', display: 'block' }}>
                  📍 Click on the map or search above to set venue location
                  {selectedLocation && (
                    <span style={{ color: '#28a745', fontWeight: '600' }}>
                      <br />✅ Location selected: {formData.latitude && formData.longitude ? 
                        `${parseFloat(formData.latitude).toFixed(6)}, ${parseFloat(formData.longitude).toFixed(6)}` : 
                        'Coordinates saved'
                      }
                    </span>
                  )}
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
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>Price per Day ($) *</label>
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
                  <small style={{ color: '#666' }}>Daily rental rate</small>
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