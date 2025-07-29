const { Booking, Hall, HallReservation } = require('../model/Association');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getWeeklyEarnings = async (req, res) => {
  try {
    const ownerId = req.user.user_id; // Get from authenticated user
    console.log('Fetching weekly earnings for owner:', ownerId);

    // Get all halls owned by this user
    const halls = await Hall.findAll({
      where: { owner_id: ownerId },
      attributes: ['hall_id']
    });

    const hallIds = halls.map(hall => hall.hall_id);
    console.log('Owner halls:', hallIds);

    if (hallIds.length === 0) {
      return res.json({ earnings: [] });
    }

    const startDate = moment().subtract(4, 'weeks').startOf('isoWeek').toDate();
    console.log('Start date for earnings:', startDate);

    const bookings = await Booking.findAll({
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
        status: 'completed',
        created_at: { [Op.gte]: startDate }
      }
    });

    console.log('Found bookings:', bookings.length);

    const weeklyEarnings = {};

    bookings.forEach(booking => {
      const week = moment(booking.created_at).isoWeek();
      const year = moment(booking.created_at).year();
      const weekKey = `${year}-W${week}`;
      
      if (!weeklyEarnings[weekKey]) {
        weeklyEarnings[weekKey] = 0;
      }
      weeklyEarnings[weekKey] += parseFloat(booking.total_amount || 0);
    });

    const formatted = Object.keys(weeklyEarnings)
      .sort()
      .map(weekKey => ({
        week: weekKey,
        amount: weeklyEarnings[weekKey].toFixed(2)
      }));

    console.log('Weekly earnings formatted:', formatted);
    res.json({ earnings: formatted });
  } catch (err) {
    console.error('Error in getWeeklyEarnings:', err);
    res.status(500).json({ 
      message: 'Failed to fetch earnings',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};
