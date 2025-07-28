const express = require('express');
const router = express.Router();

// Example GET route for bookings
router.get('/', (req, res) => {
  const { owner_id } = req.query;
  
  if (!owner_id) {
    return res.status(400).json({ error: 'Owner ID is required' });
  }

  // For now, return empty bookings - you can implement actual booking logic later
  res.json({ 
    message: 'Booking history route is working!',
    bookings: []
  });
});

// Add stats endpoint
router.get('/stats', (req, res) => {
  const { owner_id } = req.query;
  
  if (!owner_id) {
    return res.status(400).json({ error: 'Owner ID is required' });
  }

  // For now, return empty stats - you can implement actual booking logic later
  res.json({
    stats: [
      { status: 'confirmed', count: 0 },
      { status: 'pending', count: 0 },
      { status: 'cancelled', count: 0 }
    ],
    totalBookings: 0,
    totalRevenue: 0
  });
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
    const { hallId, date, startTime, endTime, guests, bookingType, numberOfDays } = req.body;
    const user_id = req.user.userId; // Get userId from token
    if (!user_id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Validate booking type
    if (!bookingType || !['daily', 'hourly'].includes(bookingType)) {
      return res.status(400).json({ error: 'Invalid booking type. Must be "daily" or "hourly"' });
    }

    // Get venue details for validation and pricing
    const venue = await Hall.findByPk(hallId);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Compose booking_date from date and startTime
    const booking_date = date && startTime ? new Date(`${date}T${startTime}`) : null;
    const end_date = date && endTime ? new Date(`${date}T${endTime}`) : null;

    // Validate booking times
    if (booking_date && end_date) {
      if (bookingType === 'hourly') {
        // Check if booking spans multiple days for hourly bookings
        const startDate = new Date(booking_date);
        const endDate = new Date(end_date);
        const diffDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          return res.status(400).json({ error: 'Hourly bookings cannot span multiple days' });
        }

        // Check minimum duration (2 hours)
        const diffHours = (endDate - startDate) / (1000 * 60 * 60);
        if (diffHours < 2) {
          return res.status(400).json({ error: 'Minimum booking duration is 2 hours for hourly bookings' });
        }

        // Validate against venue opening hours (only for hourly bookings)
        const startHour = booking_date.getHours();
        const endHour = end_date.getHours();
        const venueOpenHour = parseInt(venue.open_hour.split(':')[0]);
        const venueCloseHour = parseInt(venue.close_hour.split(':')[0]);

        if (startHour < venueOpenHour || endHour > venueCloseHour) {
          return res.status(400).json({ 
            error: `Booking time must be within venue operating hours (${venue.open_hour} - ${venue.close_hour})` 
          });
        }
      }
      // For daily bookings, no time validation needed
    }

    // Calculate total amount based on booking type
    let total_amount = 0;
    if (bookingType === 'daily') {
      const days = numberOfDays || 1;
      total_amount = venue.price * days;
    } else if (bookingType === 'hourly') {
      const startDate = new Date(booking_date);
      const endDate = new Date(end_date);
      const diffHours = (endDate - startDate) / (1000 * 60 * 60);
      
      // Calculate actual operating hours for this venue
      const venueOpenHour = parseInt(venue.open_hour.split(':')[0]);
      const venueCloseHour = parseInt(venue.close_hour.split(':')[0]);
      const operatingHours = venueCloseHour - venueOpenHour;
      
      // Calculate hourly rate based on actual operating hours
      const hourlyRate = venue.price / operatingHours;
      total_amount = hourlyRate * diffHours;
    }

    const booking = await Booking.create({
      user_id,
      total_amount,
      booking_date,
      status: 'pending',
      booking_type: bookingType,
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
      id: booking.booking_id,
      booking,
      total_amount: total_amount.toFixed(2)
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
