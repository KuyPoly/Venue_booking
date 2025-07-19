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
      },
      {
        check_in: new Date('2025-08-03T08:00:00'),
        check_out: new Date('2025-08-03T12:00:00'),
        booking_id: 3,
        hall_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-04T20:00:00'),
        check_out: new Date('2025-08-05T01:00:00'),
        booking_id: 4,
        hall_id: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-05T10:00:00'),
        check_out: new Date('2025-08-05T16:00:00'),
        booking_id: 5,
        hall_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-06T14:00:00'),
        check_out: new Date('2025-08-06T23:00:00'),
        booking_id: 6,
        hall_id: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-07T12:00:00'),
        check_out: new Date('2025-08-07T18:00:00'),
        booking_id: 7,
        hall_id: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-08T15:00:00'),
        check_out: new Date('2025-08-08T21:00:00'),
        booking_id: 8,
        hall_id: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-09T09:00:00'),
        check_out: new Date('2025-08-09T17:00:00'),
        booking_id: 9,
        hall_id: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-10T11:00:00'),
        check_out: new Date('2025-08-10T19:00:00'),
        booking_id: 10,
        hall_id: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-11T08:00:00'),
        check_out: new Date('2025-08-11T20:00:00'),
        booking_id: 11,
        hall_id: 11,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-12T19:00:00'),
        check_out: new Date('2025-08-13T01:00:00'),
        booking_id: 12,
        hall_id: 12,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-13T10:00:00'),
        check_out: new Date('2025-08-13T15:00:00'),
        booking_id: 13,
        hall_id: 13,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-14T09:00:00'),
        check_out: new Date('2025-08-14T17:00:00'),
        booking_id: 14,
        hall_id: 14,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-15T18:00:00'),
        check_out: new Date('2025-08-16T00:00:00'),
        booking_id: 15,
        hall_id: 15,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-16T12:00:00'),
        check_out: new Date('2025-08-16T20:00:00'),
        booking_id: 16,
        hall_id: 16,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-17T10:00:00'),
        check_out: new Date('2025-08-17T18:00:00'),
        booking_id: 17,
        hall_id: 17,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-18T14:00:00'),
        check_out: new Date('2025-08-18T22:00:00'),
        booking_id: 18,
        hall_id: 18,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-19T16:00:00'),
        check_out: new Date('2025-08-20T00:00:00'),
        booking_id: 19,
        hall_id: 19,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        check_in: new Date('2025-08-20T10:00:00'),
        check_out: new Date('2025-08-20T18:00:00'),
        booking_id: 20,
        hall_id: 20,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hall_reservation', null, {});
  }
};