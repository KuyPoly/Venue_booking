'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('hall_reservation', {
      id: { // Added this primary key
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      hall_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'hall',
          key: 'hall_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'booking',
          key: 'booking_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('hall_reservation');
  },
};