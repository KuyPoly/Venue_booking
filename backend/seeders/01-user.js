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
        address: '123 Main St, New York, NY',
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
        address: '456 Oak Ave, Los Angeles, CA',
        gender: 'female',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Mike',
        last_name: 'Johnson',
        dob: '1988-03-10',
        phone_number: '+1555666777',
        email: 'mike.johnson@example.com',
        password: hashedPassword,
        address: '789 Pine St, Chicago, IL',
        gender: 'male',
        role: 'owner',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'Sarah',
        last_name: 'Wilson',
        dob: '1992-11-25',
        phone_number: '+1444555666',
        email: 'sarah.wilson@example.com',
        password: hashedPassword,
        address: '321 Elm St, Miami, FL',
        gender: 'female',
        role: 'customer',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        first_name: 'David',
        last_name: 'Brown',
        dob: '1987-09-12',
        phone_number: '+1333444555',
        email: 'david.brown@example.com',
        password: hashedPassword,
        address: '654 Maple Ave, Seattle, WA',
        gender: 'male',
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