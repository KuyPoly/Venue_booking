const express = require('express');
const router = express.Router();

// Example GET route for bookings
router.get('/', (req, res) => {
  res.json({ message: 'Bookings route is working!' });
});

const Booking = require('../model/Booking');
const Hall = require('../model/Hall');
const HallReservation = require('../model/HallReservation');
const Image = require('../model/Image'); // <--- Import Image model
const { authenticateToken } = require('../controllers/favoriteController');

// POST route for creating a booking and saving to DB
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Accept frontend fields
    const { hallId, date, startTime, endTime, guests } = req.body; // <-- Add hallId
    const user_id = req.user.userId; // Get userId from token
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    // Compose booking_date from date and startTime
    const booking_date = date && startTime ? new Date(`${date}T${startTime}`) : null;
    const end_date = date && endTime ? new Date(`${date}T${endTime}`) : null;
    // Calculate total_amount (example: guests * 10, replace with real logic)
    const total_amount = guests ? Number(guests) * 10 : 0;
    const booking = await Booking.create({
      user_id,
      total_amount,
      booking_date,
      status: 'pending',
    });

    // Create the HallReservation to link the booking to the hall
    await HallReservation.create({
      booking_id: booking.booking_id,
      hall_id: hallId,
      start_date: booking_date,
      end_date: end_date,
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

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.findAll({
      where: { user_id: userId },
      include: [
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [
            {
              model: Hall,
              as: 'hall',
              include: [{ model: Image, as: 'images' }] // <-- Include images here
            }
          ],
        },
      ],
      order: [['booking_date', 'DESC']],
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching booking history:', error);
    res.status(500).json({ error: 'Failed to fetch booking history' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findOne({
      where: { booking_id: id, user_id: userId },
      include: [
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [{ model: Hall, as: 'hall', include: ['images'] }],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
});

// You can add PUT, DELETE routes here as needed

module.exports = router;
