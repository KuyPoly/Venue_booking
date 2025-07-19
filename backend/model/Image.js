const { DataTypes } = require('sequelize');
const sequelize = require('../migrations/database/db');
const Hall = require('./Hall');

const Image = sequelize.define('Image', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  order: {
    type: DataTypes.INTEGER,
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
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'image',
});

module.exports = Image; 