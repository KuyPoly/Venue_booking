'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('hall', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true,
      comment: 'Latitude coordinate for Google Maps'
    });

    await queryInterface.addColumn('hall', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true,
      comment: 'Longitude coordinate for Google Maps'
    });

    await queryInterface.addColumn('hall', 'address', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Full formatted address'
    });

    // Optionally, you can keep the old location field for backward compatibility
    // Or you can remove it by uncommenting the line below:
    // await queryInterface.removeColumn('hall', 'location');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('hall', 'latitude');
    await queryInterface.removeColumn('hall', 'longitude');
    await queryInterface.removeColumn('hall', 'address');
    
    // If you removed the location column, uncomment this to restore it:
    // await queryInterface.addColumn('hall', 'location', {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // });
  }
};
