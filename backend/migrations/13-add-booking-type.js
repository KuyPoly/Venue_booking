'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('booking', 'booking_type', {
      type: Sequelize.ENUM('daily', 'hourly'),
      allowNull: false,
      defaultValue: 'daily',
      comment: 'Type of booking: daily or hourly'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('booking', 'booking_type');
  }
}; 