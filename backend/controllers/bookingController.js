const Booking = require('../model/Booking');
const HallReservation = require('../model/HallReservation');
const Payment = require('../model/Payment');
const User = require('../model/User');
const Hall = require('../model/Hall');

// Get all bookings for owner's halls
exports.getAllBookings = async (req, res) => {
  try {
    const { owner_id } = req.query; // Should come from JWT token
    
    if (!owner_id) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }

    // Find bookings for halls owned by this owner
    const bookings = await Booking.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'firstName', 'lastName', 'email', 'phoneNumber']
        },
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [
            {
              model: Hall,
              as: 'hall',
              where: { owner_id }, // Only include halls owned by this owner
              attributes: ['hall_id', 'name', 'type', 'location', 'capacity', 'price']
            }
          ]
        },
        {
          model: Payment,
          as: 'payment',
          required: false,
          attributes: ['payment_id', 'amount', 'method', 'status', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    const transformedBookings = bookings.map(booking => ({
      bookingId: booking.booking_id,
      status: booking.status,
      totalAmount: booking.total_amount,
      bookingDate: booking.booking_date,
      createdAt: booking.created_at,
      customer: {
        id: booking.user?.user_id,
        name: `${booking.user?.firstName} ${booking.user?.lastName}`,
        email: booking.user?.email,
        phone: booking.user?.phoneNumber
      },
      halls: booking.hall_reservations?.map(reservation => ({
        hallId: reservation.hall?.hall_id,
        hallName: reservation.hall?.name,
        hallType: reservation.hall?.type,
        location: reservation.hall?.location,
        checkIn: reservation.check_in,
        checkOut: reservation.check_out
      })) || [],
      payment: booking.payment ? {
        id: booking.payment.payment_id,
        amount: booking.payment.amount,
        method: booking.payment.method,
        status: booking.payment.status,
        paidAt: booking.payment.created_at
      } : null
    }));

    res.json({
      message: `Found ${transformedBookings.length} bookings for your halls`,
      bookings: transformedBookings
    });
  } catch (err) {
    console.error('Error fetching owner bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings for your halls' });
  }
};

// Get specific booking details (for owner's halls only)
exports.getBookingById = async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'firstName', 'lastName', 'email', 'phoneNumber', 'address']
        },
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [
            {
              model: Hall,
              as: 'hall',
              where: { owner_id }, // Ensure owner can only see bookings for their halls
              attributes: ['hall_id', 'name', 'type', 'description', 'location', 'capacity', 'price']
            }
          ]
        },
        {
          model: Payment,
          as: 'payment',
          required: false
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or you do not have permission to access it' });
    }

    const transformedBooking = {
      bookingId: booking.booking_id,
      status: booking.status,
      totalAmount: booking.total_amount,
      bookingDate: booking.booking_date,
      createdAt: booking.created_at,
      customer: {
        id: booking.user?.user_id,
        firstName: booking.user?.firstName,
        lastName: booking.user?.lastName,
        email: booking.user?.email,
        phone: booking.user?.phoneNumber,
        address: booking.user?.address
      },
      halls: booking.hall_reservations?.map(reservation => ({
        reservationId: reservation.hall_reservation_id,
        hallId: reservation.hall?.hall_id,
        hallName: reservation.hall?.name,
        hallType: reservation.hall?.type,
        hallDescription: reservation.hall?.description,
        location: reservation.hall?.location,
        capacity: reservation.hall?.capacity,
        price: reservation.hall?.price,
        checkIn: reservation.check_in,
        checkOut: reservation.check_out
      })) || [],
      payment: booking.payment
    };

    res.json(transformedBooking);
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
};

// Update booking status (owner can confirm/cancel bookings)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { owner_id } = req.query;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // First check if this booking is for owner's hall
    const booking = await Booking.findOne({
      where: { booking_id: req.params.id },
      include: [
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [
            {
              model: Hall,
              as: 'hall',
              where: { owner_id }
            }
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or you do not have permission to update it' });
    }

    const [updated] = await Booking.update(
      { status },
      { where: { booking_id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Failed to update booking status' });
    }

    const updatedBooking = await Booking.findByPk(req.params.id);
    
    res.json({
      message: `Booking status updated to ${status}`,
      booking: {
        id: updatedBooking.booking_id,
        status: updatedBooking.status,
        updatedAt: updatedBooking.updated_at
      }
    });
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

// Get booking statistics for owner (dashboard data)
exports.getBookingStats = async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'Owner ID is required' });
    }

    // Get booking stats for owner's halls
    const stats = await Booking.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('booking_id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('total_amount')), 'totalRevenue']
      ],
      include: [
        {
          model: HallReservation,
          as: 'hall_reservations',
          include: [
            {
              model: Hall,
              as: 'hall',
              where: { owner_id },
              attributes: []
            }
          ],
          attributes: []
        }
      ],
      group: ['status'],
      raw: true
    });

    res.json({
      message: 'Booking statistics for your halls',
      stats
    });
  } catch (err) {
    console.error('Error fetching booking stats:', err);
    res.status(500).json({ error: 'Failed to fetch booking statistics' });
  }
};