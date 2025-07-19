'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('booking', [
      {
        status: 'confirmed',
        created_time: new Date(),
        special_request: 'Need projector.',
        total: 1500.00,
        user_id: 1, // John Doe
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date(),
        special_request: 'Extra chairs.',
        total: 800.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('booking', null, {});
  }
};