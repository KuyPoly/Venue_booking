const express = require('express');
const venueController = require('../controllers/venueController');
const router = express.Router();

router.get('/test/venues', venueController.testVenues);
router.get('/debug/venues', venueController.debugVenues);
router.get('/categories', venueController.getCategories);
router.get('/venues', venueController.getVenues);
router.get('/venues/:id', venueController.getVenueById);

module.exports = router; 