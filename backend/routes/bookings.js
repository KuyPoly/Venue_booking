const express = require('express');
const router = express.Router();

// Example GET route for bookings
router.get('/', (req, res) => {
  res.json({ message: 'Bookings route is working!' });
});

const Booking = require('../model/Booking');

// POST route for creating a booking and saving to DB
router.post('/', async (req, res) => {
  try {
    // Accept frontend fields
    const { date, startTime, endTime, guests, user_id } = req.body;
    // Compose booking_date from date and startTime
    const booking_date = date && startTime ? `${date}T${startTime}:00` : null;
    // Calculate total_amount (example: guests * 10, replace with real logic)
    const total_amount = guests ? Number(guests) * 10 : 0;
    const booking = await Booking.create({
      user_id: user_id || 1, // fallback user_id for demo
      total_amount,
      booking_date,
      status: 'pending',
    });
    res.status(201).json({ message: 'Booking created!', booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// You can add PUT, DELETE routes here as needed

module.exports = router;
