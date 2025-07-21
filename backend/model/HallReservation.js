const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Hall = require('./Hall');
const Booking = require('./Booking');

const HallReservation = sequelize.define('HallReservation', {
  payment_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hall_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hall,
      key: 'hall_id',
    },
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,
      key: 'booking_id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'hall_reservation',
});

module.exports = HallReservation; 