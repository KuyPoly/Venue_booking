const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Message = sequelize.define('Message', {
  // Define your columns here, example:
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiverId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
  // Add other fields as needed
});

module.exports = Message;
