'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('booking', [
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-15T10:30:00'),
        special_request: 'Need sound system and microphone setup.',
        total_amount: 1500.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        booking_date: new Date('2025-01-16T14:20:00'),
        special_request: 'Extra chairs for 20 additional guests.',
        total_amount: 800.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-17T09:15:00'),
        special_request: 'Projector and screen for presentation.',
        total_amount: 200.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-18T16:45:00'),
        special_request: 'DJ booth setup and dance floor lighting.',
        total_amount: 1200.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        booking_date: new Date('2025-01-19T11:30:00'),
        special_request: 'Workshop materials and flip charts.',
        total_amount: 400.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-20T13:00:00'),
        special_request: 'Red carpet entrance and photographer area.',
        total_amount: 2500.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-21T08:45:00'),
        special_request: 'Executive lunch catering setup.',
        total_amount: 600.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'cancelled',
        booking_date: new Date('2025-01-22T15:30:00'),
        special_request: 'Birthday decorations and cake table.',
        total_amount: 700.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-23T10:00:00'),
        special_request: 'Training equipment and materials.',
        total_amount: 500.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        booking_date: new Date('2025-01-24T12:15:00'),
        special_request: 'Garden ceremony arch and floral arrangements.',
        total_amount: 1800.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-25T09:30:00'),
        special_request: 'Large screen presentation setup.',
        total_amount: 1000.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-26T17:00:00'),
        special_request: 'Premium bar service and cocktail station.',
        total_amount: 900.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        booking_date: new Date('2025-01-27T11:45:00'),
        special_request: 'Art supplies and easel setup.',
        total_amount: 300.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-28T14:30:00'),
        special_request: 'Video conferencing equipment.',
        total_amount: 400.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-29T19:00:00'),
        special_request: 'Rooftop heaters and weather protection.',
        total_amount: 1600.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        booking_date: new Date('2025-01-30T10:30:00'),
        special_request: 'Vintage decor and period music.',
        total_amount: 1300.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-01-31T13:15:00'),
        special_request: 'Tech demo stations and charging ports.',
        total_amount: 550.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-02-01T16:20:00'),
        special_request: 'Community potluck setup and kitchen access.',
        total_amount: 600.00,
        user_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'pending',
        booking_date: new Date('2025-02-02T11:00:00'),
        special_request: 'Gold linens and crystal centerpieces.',
        total_amount: 3000.00,
        user_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        status: 'confirmed',
        booking_date: new Date('2025-02-03T15:45:00'),
        special_request: 'Casual networking setup and coffee station.',
        total_amount: 250.00,
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