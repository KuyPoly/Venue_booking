'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('payment', [
      {
        paid_at: new Date(),
        method: 'credit_card',
        status: 'paid',
        booking_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        paid_at: new Date(),
        method: 'paypal',
        status: 'pending',
        booking_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('payment', null, {});
  }
};