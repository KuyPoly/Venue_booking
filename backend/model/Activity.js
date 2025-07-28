const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Activity = sequelize.define('Activity', {
  activity_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  owner_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'activities',
  timestamps: true
});

module.exports = Activity;
