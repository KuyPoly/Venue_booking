const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Listing = sequelize.define('Listing', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
  // Add other fields as needed
});

module.exports = Listing;

exports.remove = async (id) => {
  const [result] = await db.promise().query('DELETE FROM listings WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
