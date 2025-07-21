'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('hall', 'type');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('hall', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'venue'
    });
  }
};
