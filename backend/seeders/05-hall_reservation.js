'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hall_reservation', [
      {
        check_in: new Date('2025-08-01T10:00:00'),
        check_out: new Date('2025-08-01T18:00:00'),
        booking_id: 1,
        hall_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-02T09:00:00'),
        check_out: new Date('2025-08-02T17:00:00'),
        booking_id: 2,
        hall_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hall_reservation', null, {});
  }
};