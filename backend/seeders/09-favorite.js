'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('favorite', [
      {
        user_id: 1,
        hall_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        hall_id: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        hall_id: 15,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        hall_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        hall_id: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        hall_id: 19,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        hall_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        hall_id: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 4,
        hall_id: 17,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_id: 1,
        hall_id: 8,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('favorite', null, {});
  }
};