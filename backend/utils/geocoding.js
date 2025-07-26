const axios = require('axios');

/**
 * Geocode an address to get latitude and longitude using Google Maps API
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number, formatted_address: string}>}
 */
const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: apiKey
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }

    const result = response.data.results[0];
    const location = result.geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng,
      formatted_address: result.formatted_address
    };
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw error;
  }
};

/**
 * Reverse geocode coordinates to get an address
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<string>} formatted address
 */
const reverseGeocode = async (latitude, longitude) => {
  try {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${latitude},${longitude}`,
        key: apiKey
      }
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Reverse geocoding failed: ${response.data.status}`);
    }

    return response.data.results[0].formatted_address;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    throw error;
  }
};

module.exports = {
  geocodeAddress,
  reverseGeocode
};
