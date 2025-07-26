const express = require('express');
const { geocodeAddress, reverseGeocode } = require('../utils/geocoding');
const router = express.Router();

// Geocode an address to get coordinates
router.post('/geocode', async (req, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const result = await geocodeAddress(address);
    res.json(result);
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ error: 'Failed to geocode address', details: error.message });
  }
});

// Reverse geocode coordinates to get address
router.post('/reverse-geocode', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const address = await reverseGeocode(latitude, longitude);
    res.json({ address });
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    res.status(500).json({ error: 'Failed to reverse geocode coordinates', details: error.message });
  }
});

module.exports = router;
