'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hall', [
      {
        type: 'Wedding Hall',
        description: 'Elegant wedding hall.',
        location: '123 Celebration Ave',
        capacity: 200,
        price: 1500.00,
        open_hour: '09:00:00',
        close_hour: '23:00:00',
        image_url: 'https://example.com/images/wedding-hall.jpg',
        owner_id: 2, // Jane Smith
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        type: 'Conference Hall',
        description: 'Modern conference hall.',
        location: '456 Business District',
        capacity: 150,
        price: 800.00,
        open_hour: '08:00:00',
        close_hour: '22:00:00',
        image_url: 'https://example.com/images/conference-hall.jpg',
        owner_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hall', null, {});
  }
};