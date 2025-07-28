const { Booking } = require('../model');
const { Op } = require('sequelize');
const moment = require('moment');

exports.getWeeklyEarnings = async (req, res) => {
  const ownerId = req.query.owner_id;

  try {
    const startDate = moment().subtract(4, 'weeks').startOf('isoWeek').toDate();

    const bookings = await Booking.findAll({
      where: {
        owner_id: ownerId,
        status: 'completed',
        createdAt: { [Op.gte]: startDate }
      }
    });

    const weeklyEarnings = {};

    bookings.forEach(b => {
      const week = moment(b.createdAt).isoWeek();
      if (!weeklyEarnings[week]) {
        weeklyEarnings[week] = 0;
      }
      weeklyEarnings[week] += b.amount;
    });

    const formatted = Object.keys(weeklyEarnings).map(week => ({
      week,
      amount: weeklyEarnings[week]
    }));

    res.json({ earnings: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch earnings' });
  }
};
