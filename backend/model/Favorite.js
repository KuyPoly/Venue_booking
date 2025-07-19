const { DataTypes } = require('sequelize');
const sequelize = require('../migrations/database/db');
const User = require('./User');
const Hall = require('./Hall');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
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
  tableName: 'favorite',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'hall_id'],
      name: 'unique_favorite_user_hall',
    },
  ],
});

module.exports = Favorite; 