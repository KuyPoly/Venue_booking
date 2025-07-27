const { Booking, Hall, User, HallReservation } = require('../model/Association');
const { Op, sequelize } = require('sequelize');

class BookingController {
  // Get booking statistics for dashboard
  static async getBookingStats(ownerId) {
    try {
      // Get all halls by this owner
      const halls = await Hall.findAll({
        where: { owner_id: ownerId },
        attributes: ['hall_id']
      });

      const hallIds = halls.map(hall => hall.hall_id);

      if (hallIds.length === 0) {
        return {
          stats: [],
          totalBookings: 0,
          totalRevenue: 0
        }
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

      return {
        stats: bookingStats,
        totalBookings,
        totalRevenue: totalRevenue.toFixed(2)
      };
    } catch (error) {
      throw new Error('Failed to fetch booking statistics');
    }
  }

  // Get all bookings for owner's halls
  static async getOwnerBookings(ownerId) {
    try {
      // Get all halls by this owner
      const halls = await Hall.findAll({
        where: { owner_id: ownerId },
        attributes: ['hall_id', 'name']
      });

      const hallIds = halls.map(hall => hall.hall_id);

      if (hallIds.length === 0) {
        return { booking: [] };
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

      return { booking: transformedBookings };
    } catch (error) {
      throw new Error('Failed to fetch bookings');
    }
  }

  // Get specific booking by ID
  static async getBookingById(bookingId) {
    try {
      const booking = await Booking.findByPk(bookingId, {
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
        throw new Error('Booking not found');
      }

      return { booking };
    } catch (error) {
      throw new Error('Failed to fetch booking');
    }
  }

  // Create new booking
  static async createBooking(bookingData) {
    try {
      // Validate required fields
      if (!bookingData.user_id || !bookingData.total_amount || !bookingData.booking_date) {
        throw new Error('Missing required fields');
      }

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

      return { booking: newBooking };
    } catch (error) {
      throw new Error('Failed to create booking');
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId, updateData) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Validate status transition
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (updateData.status && !validStatuses.includes(updateData.status)) {
        throw new Error('Invalid status');
      }

      await booking.update(updateData);
      return { booking };
    } catch (error) {
      throw new Error('Failed to update booking');
    }
  }

  // Cancel booking
  static async cancelBooking(bookingId) {
    try {
      const booking = await Booking.findByPk(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Delete associated hall reservations first
      await HallReservation.destroy({
        where: { booking_id: bookingId }
      });

      await booking.destroy();
      return { message: 'Booking cancelled successfully' };
    } catch (error) {
      throw new Error('Failed to cancel booking');
    }
  }

  // Check hall availability
  static async checkHallAvailability(hallId, startDate, endDate, excludeBookingId = null) {
    try {
      const whereClause = {
        hall_id: hallId,
        [Op.or]: [
          {
            start_date: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            end_date: {
              [Op.between]: [startDate, endDate]
            }
          },
          {
            [Op.and]: [
              { start_date: { [Op.lte]: startDate } },
              { end_date: { [Op.gte]: endDate } }
            ]
          }
        ]
      };

      if (excludeBookingId) {
        whereClause.booking_id = { [Op.ne]: excludeBookingId };
      }

      const conflictingReservations = await HallReservation.findAll({
        where: whereClause,
        include: [{
          model: Booking,
          as: 'booking',
          where: { status: { [Op.in]: ['pending', 'confirmed'] } }
        }]
      });

      return conflictingReservations.length === 0;
    } catch (error) {
      throw new Error('Failed to check hall availability');
    }
  }

  // Get booking analytics
  static async getBookingAnalytics(ownerId) {
    try {
      const halls = await Hall.findAll({
        where: { owner_id: ownerId },
        attributes: ['hall_id']
      });

      const hallIds = halls.map(hall => hall.hall_id);

      if (hallIds.length === 0) {
        return {
          monthlyBookings: [],
          revenueData: [],
          bookingStatusDistribution: []
        };
      }

      // Get monthly booking data for the last 6 months
      const monthlyBookings = await Booking.findAll({
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
          created_at: {
            [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        },
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('Booking.created_at'), '%Y-%m'), 'month'],
          [sequelize.fn('COUNT', sequelize.col('Booking.booking_id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('Booking.total_amount')), 'revenue']
        ],
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('Booking.created_at'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('Booking.created_at'), '%Y-%m'), 'ASC']],
        raw: true
      });

      // Get booking status distribution
      const bookingStatusDistribution = await Booking.findAll({
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
          [sequelize.fn('COUNT', sequelize.col('Booking.booking_id')), 'count']
        ],
        group: ['Booking.status'],
        raw: true
      });

      return {
        monthlyBookings,
        revenueData: monthlyBookings.map(item => ({
          month: item.month,
          revenue: parseFloat(item.revenue) || 0
        })),
        bookingStatusDistribution
      };
    } catch (error) {
      throw new Error('Failed to fetch booking analytics');
    }
  }
}

module.exports = BookingController; 