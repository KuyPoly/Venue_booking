'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('category', [
      {
        name: 'meeting',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'workshop',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'wedding',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'party',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('category', null, {});
  }
};