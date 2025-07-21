const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Owner booking management routes
router.get('/', bookingController.getAllBookings); // Get all bookings for owner's halls
router.get('/stats', bookingController.getBookingStats); // Get booking statistics
router.get('/:id', bookingController.getBookingById); // Get specific booking details
router.patch('/:id/status', bookingController.updateBookingStatus); // Update booking status

module.exports = router;