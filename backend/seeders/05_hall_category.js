'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hall_category', [
      // Wedding halls (category_id: 3)
      { hall_id: 1, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { hall_id: 6, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { hall_id: 10, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { hall_id: 16, category_id: 3, created_at: new Date(), updated_at: new Date() },
      { hall_id: 19, category_id: 3, created_at: new Date(), updated_at: new Date() },

      // Meeting halls (category_id: 1)
      { hall_id: 2, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { hall_id: 3, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { hall_id: 7, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { hall_id: 11, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { hall_id: 14, category_id: 1, created_at: new Date(), updated_at: new Date() },
      { hall_id: 20, category_id: 1, created_at: new Date(), updated_at: new Date() },

      // Workshop halls (category_id: 2)
      { hall_id: 5, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { hall_id: 9, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { hall_id: 13, category_id: 2, created_at: new Date(), updated_at: new Date() },
      { hall_id: 17, category_id: 2, created_at: new Date(), updated_at: new Date() },

      // Party halls (category_id: 4)
      { hall_id: 4, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { hall_id: 8, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { hall_id: 12, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { hall_id: 15, category_id: 4, created_at: new Date(), updated_at: new Date() },
      { hall_id: 18, category_id: 4, created_at: new Date(), updated_at: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hall_category', null, {});
  }
};