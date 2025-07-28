const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/bookingController');

// GET /booking-management/pending?owner_id=123 - Get pending bookings
router.get('/pending', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    const result = await BookingController.getOwnerBookings(owner_id);
    const pendingBookings = result.booking.filter(booking => booking.status === 'pending');
    
    res.json({ booking: pendingBookings });
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    res.status(500).json({ error: 'Failed to fetch pending bookings' });
  }
});

// PUT /booking-management/:id/approve - Approve a booking
router.put('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await BookingController.updateBookingStatus(id, { status: 'confirmed' });

    // Credit wallet when booking is confirmed
    if (result.booking && result.booking.status === 'confirmed') {
      try {
        // Get booking details to find the owner and amount
        const booking = await require('../model/Booking').findByPk(id, {
          include: [{
            model: require('../model/HallReservation'),
            as: 'hall_reservations',
            include: [{
              model: require('../model/Hall'),
              as: 'hall',
              attributes: ['owner_id']
            }]
          }]
        });
        if (booking && booking.hall_reservations && booking.hall_reservations[0]) {
          const ownerId = booking.hall_reservations[0].hall.owner_id;
          const amount = booking.total_amount;
          await require('../controllers/walletController').creditWalletFromBooking(id, amount, ownerId, `Payment received for booking ${id}`);
          console.log(`Wallet credited for owner ${ownerId}: $${amount} from booking ${id}`);
        }
      } catch (walletError) {
        console.error('Error crediting wallet:', walletError);
        // Don't fail the approval if wallet credit fails
      }
    }

    res.json({ message: 'Booking approved successfully', booking: result.booking });
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ error: 'Failed to approve booking' });
  }
});

// PUT /booking-management/:id/reject - Reject a booking
router.put('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await BookingController.updateBookingStatus(id, { status: 'cancelled' });
    res.json({ message: 'Booking rejected successfully', booking: result.booking });
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ error: 'Failed to reject booking' });
  }
});

// PUT /booking-management/:id/complete - Mark booking as completed
router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await BookingController.updateBookingStatus(id, { status: 'completed' });
    res.json({ message: 'Booking marked as completed', booking: result.booking });
  } catch (error) {
    console.error('Error completing booking:', error);
    res.status(500).json({ error: 'Failed to complete booking' });
  }
});

// GET /booking-management/analytics?owner_id=123 - Get booking analytics
router.get('/analytics', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    const analytics = await BookingController.getBookingAnalytics(owner_id);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching booking analytics:', error);
    res.status(500).json({ error: 'Failed to fetch booking analytics' });
  }
});

// GET /booking-management/availability?hall_id=123&start_date=2024-01-01&end_date=2024-01-02
router.get('/availability', async (req, res) => {
  try {
    const { hall_id, start_date, end_date } = req.query;
    
    if (!hall_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'hall_id, start_date, and end_date are required' });
    }

    const isAvailable = await BookingController.checkHallAvailability(
      hall_id, 
      new Date(start_date), 
      new Date(end_date)
    );
    
    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// GET /booking-management/status-summary?owner_id=123 - Get booking status summary
router.get('/status-summary', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    const stats = await BookingController.getBookingStats(owner_id);
    
    // Group by status
    const statusSummary = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0
    };

    stats.stats.forEach(stat => {
      statusSummary[stat.status] = parseInt(stat.count);
    });

    res.json({
      totalBookings: stats.totalBookings,
      totalRevenue: stats.totalRevenue,
      statusSummary
    });
  } catch (error) {
    console.error('Error fetching status summary:', error);
    res.status(500).json({ error: 'Failed to fetch status summary' });
  }
});

module.exports = router; 