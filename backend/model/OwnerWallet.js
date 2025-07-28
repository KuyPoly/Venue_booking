const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const OwnerWallet = sequelize.define('OwnerWallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalWithdrawals: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'closed'),
    allowNull: false,
    defaultValue: 'active'
  }
}, {
  tableName: 'owner_wallets',
  timestamps: true
});

module.exports = OwnerWallet;
