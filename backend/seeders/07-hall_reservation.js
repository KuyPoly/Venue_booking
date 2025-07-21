'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bookings = await queryInterface.sequelize.query(
      'SELECT booking_id, booking_date FROM booking',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const hallReservations = bookings.map((booking, index) => {
      const startDate = new Date(booking.booking_date);
      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours

      return {
        booking_id: booking.booking_id,
        hall_id: index + 1, // This assumes hall_id matches the booking index, adjust if needed
        start_date: startDate,
        end_date: endDate,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    await queryInterface.bulkInsert('hall_reservation', hallReservations, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hall_reservation', null, {});
  }
};