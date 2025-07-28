'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('owner_wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      totalEarnings: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      totalWithdrawals: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      status: {
        type: Sequelize.ENUM('active', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'active'
      },
      lastTransactionAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add unique constraint on ownerId
    await queryInterface.addIndex('owner_wallets', ['ownerId'], {
      unique: true,
      name: 'unique_owner_wallet'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('owner_wallets');
  }
};