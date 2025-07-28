'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // MySQL: Alter the ENUM to add 'rejected'
    return queryInterface.sequelize.query(`
      ALTER TABLE booking MODIFY status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'rejected') NOT NULL DEFAULT 'pending';
    `);
  },
  down: async (queryInterface, Sequelize) => {
    // No rollback for ENUM value addition
    return Promise.resolve();
  }
}; 