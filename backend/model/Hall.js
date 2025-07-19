const { DataTypes } = require('sequelize');
const sequelize = require('../migrations/database/db');
const User = require('./User');

const Hall = sequelize.define('Hall', {
  hall_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  open_hour: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  close_hour: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'hall',
});

module.exports = Hall; 