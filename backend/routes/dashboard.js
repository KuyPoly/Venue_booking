const express = require('express');
const router = express.Router();
const { Hall, Booking, User, HallReservation } = require('../model/Association');
const { Op, sequelize } = require('sequelize');

// GET /dashboard/stats?owner_id=123 - Get comprehensive dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    // Get all halls by this owner
    const halls = await Hall.findAll({
      where: { owner_id: owner_id },
      attributes: ['hall_id', 'name', 'price']
    });

    const hallIds = halls.map(hall => hall.hall_id);

    if (hallIds.length === 0) {
      return res.json({
        stats: {
          totalListings: 0,
          totalBookings: 0,
          totalRevenue: 0,
          pendingBookings: 0,
          confirmedBookings: 0,
          cancelledBookings: 0,
          completedBookings: 0
        }
      });
    }

    // Get booking statistics
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
    
    // Get counts by status
    const pendingBookings = bookingStats.find(stat => stat.status === 'pending')?.count || 0;
    const confirmedBookings = bookingStats.find(stat => stat.status === 'confirmed')?.count || 0;
    const cancelledBookings = bookingStats.find(stat => stat.status === 'cancelled')?.count || 0;
    const completedBookings = bookingStats.find(stat => stat.status === 'completed')?.count || 0;

    res.json({
      stats: {
        totalListings: halls.length,
        totalBookings,
        totalRevenue: totalRevenue.toFixed(2),
        pendingBookings: parseInt(pendingBookings),
        confirmedBookings: parseInt(confirmedBookings),
        cancelledBookings: parseInt(cancelledBookings),
        completedBookings: parseInt(completedBookings)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
});

// GET /dashboard/recent-bookings?owner_id=123 - Get recent bookings
router.get('/recent-bookings', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    // Get all halls by this owner
    const halls = await Hall.findAll({
      where: { owner_id: owner_id },
      attributes: ['hall_id']
    });

    const hallIds = halls.map(hall => hall.hall_id);

    if (hallIds.length === 0) {
      return res.json({ recentBookings: [] });
    }

    // Get recent bookings
    const recentBookings = await Booking.findAll({
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

    const transformedBookings = recentBookings.map(booking => ({
      bookingId: booking.booking_id,
      customerName: `${booking.user.first_name} ${booking.user.last_name}`,
      customerEmail: booking.user.email,
      halls: booking.hall_reservations.map(reservation => reservation.hall.name).join(', '),
      totalAmount: booking.total_amount,
      status: booking.status,
      createdAt: booking.created_at
    }));

    res.json({ recentBookings: transformedBookings });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ error: 'Failed to fetch recent bookings' });
  }
});

// GET /dashboard/earnings?owner_id=123 - Get earnings data
router.get('/earnings', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    // Get all halls by this owner
    const halls = await Hall.findAll({
      where: { owner_id: owner_id },
      attributes: ['hall_id']
    });

    const hallIds = halls.map(hall => hall.hall_id);

    if (hallIds.length === 0) {
      return res.json({ earnings: { total: 0, monthly: 0, weekly: 0 } });
    }

    // Get earnings data
    const earnings = await Booking.findAll({
      include: [{
        model: HallReservation,
        as: 'hall_reservations',
        include: [{
          model: Hall,
          as: 'hall',
          where: { hall_id: { [Op.in]: hallIds } }
        }]
      }],
      where: {
        status: 'confirmed',
        created_at: {
          [Op.gte]: new Date(new Date().getFullYear(), 0, 1) // This year
        }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('Booking.total_amount')), 'totalEarnings']
      ],
      raw: true
    });

    const totalEarnings = parseFloat(earnings[0]?.totalEarnings || 0);

    res.json({
      earnings: {
        total: totalEarnings.toFixed(2),
        monthly: (totalEarnings / 12).toFixed(2),
        weekly: (totalEarnings / 52).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ error: 'Failed to fetch earnings data' });
  }
});

module.exports = router; 