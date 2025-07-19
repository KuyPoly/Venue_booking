'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await queryInterface.bulkInsert('user', [
      {
        first_name: 'John',
        last_name: 'Doe',
        dob: '1990-01-15',
        phone_number: '+1234567890',
        email: 'john.doe@example.com',
        password: hashedPassword,
        address: '123 Main St, City, State',
        gender: 'male',
        role: 'customer',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        dob: '1985-06-20',
        phone_number: '+1987654321',
        email: 'jane.smith@example.com',
        password: hashedPassword,
        address: '456 Oak Ave, City, State',
        gender: 'female',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', null, {});
  }
};