const express = require('express');
const router = express.Router();

// Example GET route for bookings
router.get('/', (req, res) => {
  res.json({ message: 'Bookings route is working!' });
});

const Booking = require('../model/Booking');
const { authenticateToken } = require('../controllers/favoriteController');

// POST route for creating a booking and saving to DB
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Accept frontend fields
    const { date, startTime, endTime, guests } = req.body;
    const user_id = req.user.userId; // Get userId from token
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Compose booking_date from date and startTime
    const booking_date = date && startTime ? `${date}T${startTime}:00` : null;
    // Calculate total_amount (example: guests * 10, replace with real logic)
    const total_amount = guests ? Number(guests) * 10 : 0;
    const booking = await Booking.create({
      user_id,
      total_amount,
      booking_date,
      status: 'pending',
    });
    res.status(201).json({ 
      message: 'Booking created!', 
      id: booking.booking_id, // <-- Add this line for frontend compatibility
      booking 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// You can add PUT, DELETE routes here as needed

module.exports = router;
