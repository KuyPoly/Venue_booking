'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('booking', [
      {
        status: 'confirmed',
        created_time: new Date('2025-01-15T10:30:00'),
        special_request: 'Need sound system and microphone setup.',
        total: 1500.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date('2025-01-16T14:20:00'),
        special_request: 'Extra chairs for 20 additional guests.',
        total: 800.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-17T09:15:00'),
        special_request: 'Projector and screen for presentation.',
        total: 200.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-18T16:45:00'),
        special_request: 'DJ booth setup and dance floor lighting.',
        total: 1200.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date('2025-01-19T11:30:00'),
        special_request: 'Workshop materials and flip charts.',
        total: 400.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-20T13:00:00'),
        special_request: 'Red carpet entrance and photographer area.',
        total: 2500.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-21T08:45:00'),
        special_request: 'Executive lunch catering setup.',
        total: 600.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'cancelled',
        created_time: new Date('2025-01-22T15:30:00'),
        special_request: 'Birthday decorations and cake table.',
        total: 700.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-23T10:00:00'),
        special_request: 'Training equipment and materials.',
        total: 500.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date('2025-01-24T12:15:00'),
        special_request: 'Garden ceremony arch and floral arrangements.',
        total: 1800.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-25T09:30:00'),
        special_request: 'Large screen presentation setup.',
        total: 1000.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-26T17:00:00'),
        special_request: 'Premium bar service and cocktail station.',
        total: 900.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date('2025-01-27T11:45:00'),
        special_request: 'Art supplies and easel setup.',
        total: 300.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-28T14:30:00'),
        special_request: 'Video conferencing equipment.',
        total: 400.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-29T19:00:00'),
        special_request: 'Rooftop heaters and weather protection.',
        total: 1600.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date('2025-01-30T10:30:00'),
        special_request: 'Vintage decor and period music.',
        total: 1300.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-01-31T13:15:00'),
        special_request: 'Tech demo stations and charging ports.',
        total: 550.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-02-01T16:20:00'),
        special_request: 'Community potluck setup and kitchen access.',
        total: 600.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        created_time: new Date('2025-02-02T11:00:00'),
        special_request: 'Gold linens and crystal centerpieces.',
        total: 3000.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        created_time: new Date('2025-02-03T15:45:00'),
        special_request: 'Casual networking setup and coffee station.',
        total: 250.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('booking', null, {});
  }
};