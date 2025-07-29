const express = require('express');
const router = express.Router();
const { Booking, Hall, User, HallReservation } = require('../model/Association');
const { Op } = require('sequelize');
const sequelize = require('../database/sequelize');
const { authenticateToken } = require('../middleware/auth');



// GET /booking/stats?owner_id=123 - Get booking statistics for dashboard


router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const owner_id = req.user.user_id; // Get from authenticated user
    
    // Get all halls by this owner
    const halls = await Hall.findAll({
      where: { owner_id: owner_id },
      attributes: ['hall_id']
    });

    const hallIds = halls.map(hall => hall.hall_id);

    if (hallIds.length === 0) {
      return res.json({ 
        stats: [],
        totalBookings: 0,
        totalRevenue: 0
      });
    }

    // Get booking statistics grouped by status
    const bookingStats = await Booking.findAll({
      include: [{
        model: HallReservation,
        as: 'hall_reservations',
        include: [{
          model: Hall,
          as: 'hall',
          where: { hall_id: { [Op.in]: hallIds } }
        }]
      }],
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('Booking.booking_id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('Booking.total_amount')), 'totalAmount']
      ],
      group: ['Booking.status'],
      raw: true
    });

    // Calculate totals
    const totalBookings = bookingStats.reduce((sum, stat) => sum + parseInt(stat.count), 0);
    const totalRevenue = bookingStats.reduce((sum, stat) => sum + (parseFloat(stat.totalAmount) || 0), 0);

    res.json({
      stats: bookingStats,
      totalBookings,
      totalRevenue: totalRevenue.toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
});

// GET /booking - Get all bookings for owner's halls
router.get('/', authenticateToken, async (req, res) => {
  try {
    const owner_id = req.user.user_id; // Get from authenticated user
    
    // Get all halls by this owner
    const halls = await Hall.findAll({
      where: { owner_id: owner_id },
      attributes: ['hall_id', 'name']
    });

    const hallIds = halls.map(hall => hall.hall_id);

    if (hallIds.length === 0) {
      return res.json({ booking: [] });
    }

    // Get all bookings for these halls
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number']
        },
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [{
            model: Hall,
            as: 'hall',
            where: { hall_id: { [Op.in]: hallIds } },
            attributes: ['hall_id', 'name', 'description']
          }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Transform the data to match frontend expectations
    const transformedBookings = bookings.map(booking => ({
      bookingId: booking.booking_id,
      customer: {
        name: `${booking.user.first_name} ${booking.user.last_name}`,
        email: booking.user.email,
        phone: booking.user.phone_number
      },
      halls: booking.hall_reservations.map(reservation => ({
        hallId: reservation.hall.hall_id,
        hallName: reservation.hall.name,
        description: reservation.hall.description,
        startDate: reservation.start_date,
        endDate: reservation.end_date
      })),
      totalAmount: booking.total_amount,
      bookingDate: booking.booking_date,
      status: booking.status,
      createdAt: booking.created_at
    }));

    res.json({ booking: transformedBookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /booking/:id - Get specific booking
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number']
        },
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [{
            model: Hall,
            as: 'hall',
            attributes: ['hall_id', 'name', 'description', 'owner_id']
          }]
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST /booking - Create new booking
router.post('/', async (req, res) => {
  try {
    const bookingData = req.body;
    
    // Create the booking
    const newBooking = await Booking.create({
      user_id: bookingData.user_id,
      total_amount: bookingData.total_amount,
      booking_date: bookingData.booking_date,
      status: 'pending'
    });

    // Create hall reservations
    if (bookingData.hall_reservations && bookingData.hall_reservations.length > 0) {
      const hallReservations = bookingData.hall_reservations.map(reservation => ({
        booking_id: newBooking.booking_id,
        hall_id: reservation.hall_id,
        start_date: reservation.start_date,
        end_date: reservation.end_date
      }));

      await HallReservation.bulkCreate(hallReservations);
    }

    res.status(201).json({ booking: newBooking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT /booking/:id - Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.update(updateData);
    res.json({ booking });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /booking/:id - Cancel booking
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Delete associated hall reservations first
    await HallReservation.destroy({
      where: { booking_id: id }
    });

    await booking.destroy();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// GET /booking/requests - Get pending booking requests for owner
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const owner_id = req.user.user_id; // Get from authenticated user
    console.log('Booking requests for owner:', owner_id);
    
    // Get all halls by this owner
    const halls = await Hall.findAll({
      where: { owner_id: owner_id },
      attributes: ['hall_id', 'name']
    });

    console.log('Found halls for requests:', halls.length);
    const hallIds = halls.map(hall => hall.hall_id);

    if (hallIds.length === 0) {
      console.log('No halls found, returning empty requests');
      return res.json({ requests: [] });
    }

    // Get pending bookings for these halls
    const requests = await Booking.findAll({
      where: { status: 'pending' },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email']
        },
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [{
            model: Hall,
            as: 'hall',
            where: { hall_id: { [Op.in]: hallIds } },
            attributes: ['hall_id', 'name']
          }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });

    console.log('Found booking requests:', requests.length);
    res.json({ requests });
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to fetch booking requests',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router; 