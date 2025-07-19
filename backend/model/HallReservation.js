const { DataTypes } = require('sequelize');
const sequelize = require('../migrations/database/db');
const Booking = require('./Booking');
const Hall = require('./Hall');

const HallReservation = sequelize.define('HallReservation', {
  hall_reservation_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  check_in: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  check_out: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Booking,
      key: 'booking_id',
    },
  },
  hall_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hall,
      key: 'hall_id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'hall_reservation',
});

HallReservation.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });
Booking.hasMany(HallReservation, { foreignKey: 'booking_id', as: 'hall_reservations' });

HallReservation.belongsTo(Hall, { foreignKey: 'hall_id', as: 'hall' });
Hall.hasMany(HallReservation, { foreignKey: 'hall_id', as: 'hall_reservations' });

module.exports = HallReservation; 