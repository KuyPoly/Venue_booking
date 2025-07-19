const { DataTypes } = require('sequelize');
const sequelize = require('../migrations/database/db');
const Hall = require('./Hall');
const Category = require('./Category');

const HallCategory = sequelize.define('HallCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hall_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Hall,
      key: 'hall_id',
    },
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'hall_category',
});

module.exports = HallCategory; 