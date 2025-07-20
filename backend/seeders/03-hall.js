'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('hall', [
      // Halls owned by Jane Smith (user_id: 2)
      {
        name: 'Crystal Palace',
        type: 'Wedding Hall',
        description: 'Elegant wedding hall with crystal chandeliers and marble floors.',
        location: '123 Celebration Ave, Downtown',
        capacity: 200,
        price: 1500.00,
        open_hour: '09:00:00',
        close_hour: '23:00:00',
        owner_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Summit Center',
        type: 'Conference Hall',
        description: 'Modern conference hall with state-of-the-art AV equipment.',
        location: '456 Business District, Corporate Plaza',
        capacity: 150,
        price: 800.00,
        open_hour: '08:00:00',
        close_hour: '22:00:00',
        owner_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Boardroom One',
        type: 'Meeting Room',
        description: 'Intimate meeting room perfect for small business gatherings.',
        location: '789 Office Park, Suite 100',
        capacity: 25,
        price: 200.00,
        open_hour: '07:00:00',
        close_hour: '20:00:00',
        owner_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Groove Hall',
        type: 'Party Hall',
        description: 'Vibrant party hall with dance floor and sound system.',
        location: '321 Party Lane, Entertainment District',
        capacity: 180,
        price: 1200.00,
        open_hour: '18:00:00',
        close_hour: '02:00:00',
        owner_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Artisan Studio',
        type: 'Workshop Space',
        description: 'Creative workshop space with flexible seating arrangements.',
        location: '654 Creative St, Arts District',
        capacity: 50,
        price: 400.00,
        open_hour: '09:00:00',
        close_hour: '18:00:00',
        owner_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      
      // Halls owned by Mike Johnson (user_id: 3)
      {
        name: 'Grand Ballroom',
        type: 'Grand Ballroom',
        description: 'Luxurious grand ballroom for upscale events and weddings.',
        location: '987 Grand Ave, Luxury District',
        capacity: 300,
        price: 2500.00,
        open_hour: '10:00:00',
        close_hour: '24:00:00',
        owner_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Executive Suite',
        type: 'Executive Conference',
        description: 'Premium executive conference room with leather seating.',
        location: '147 Executive Blvd, Financial District',
        capacity: 40,
        price: 600.00,
        open_hour: '08:00:00',
        close_hour: '20:00:00',
        owner_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Birthday Bash Hall',
        type: 'Birthday Party Hall',
        description: 'Fun and colorful hall perfect for birthday celebrations.',
        location: '258 Birthday Blvd, Family District',
        capacity: 100,
        price: 700.00,
        open_hour: '10:00:00',
        close_hour: '22:00:00',
        owner_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'SkillUp Lab',
        type: 'Training Workshop',
        description: 'Professional training space with whiteboards and projectors.',
        location: '369 Training Ave, Education District',
        capacity: 80,
        price: 500.00,
        open_hour: '08:00:00',
        close_hour: '19:00:00',
        owner_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Garden Bliss',
        type: 'Garden Wedding Venue',
        description: 'Beautiful outdoor garden venue for romantic weddings.',
        location: '741 Garden Way, Countryside',
        capacity: 120,
        price: 1800.00,
        open_hour: '09:00:00',
        close_hour: '23:00:00',
        owner_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      },

      // Halls owned by David Brown (user_id: 5)
      {
        name: 'Corporate Auditorium',
        type: 'Corporate Auditorium',
        description: 'Large auditorium for corporate presentations and seminars.',
        location: '852 Corporate Dr, Business Park',
        capacity: 250,
        price: 1000.00,
        open_hour: '08:00:00',
        close_hour: '21:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Cocktail Lounge',
        type: 'Cocktail Lounge',
        description: 'Sophisticated lounge for cocktail parties and networking.',
        location: '963 Cocktail St, Nightlife District',
        capacity: 75,
        price: 900.00,
        open_hour: '17:00:00',
        close_hour: '02:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Art Workshop Studio',
        type: 'Art Workshop Studio',
        description: 'Creative studio space for art workshops and classes.',
        location: '159 Artist Ave, Creative Quarter',
        capacity: 30,
        price: 300.00,
        open_hour: '09:00:00',
        close_hour: '18:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Boardroom Elite',
        type: 'Boardroom Elite',
        description: 'Premium boardroom for high-level executive meetings.',
        location: '753 Executive Tower, Floor 20',
        capacity: 16,
        price: 400.00,
        open_hour: '08:00:00',
        close_hour: '18:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Skyline Deck',
        type: 'Rooftop Party Deck',
        description: 'Stunning rooftop venue with city skyline views.',
        location: '486 Skyline Blvd, Tower District',
        capacity: 150,
        price: 1600.00,
        open_hour: '16:00:00',
        close_hour: '01:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Vintage Chapel',
        type: 'Vintage Wedding Chapel',
        description: 'Charming vintage chapel for intimate wedding ceremonies.',
        location: '357 Chapel Hill, Historic District',
        capacity: 80,
        price: 1300.00,
        open_hour: '10:00:00',
        close_hour: '22:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Tech Lab',
        type: 'Tech Innovation Lab',
        description: 'Modern workshop space equipped with latest technology.',
        location: '864 Innovation Dr, Tech Park',
        capacity: 60,
        price: 550.00,
        open_hour: '09:00:00',
        close_hour: '20:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Community Center',
        type: 'Community Center Hall',
        description: 'Versatile community hall for various local events.',
        location: '975 Community Blvd, Residential Area',
        capacity: 200,
        price: 600.00,
        open_hour: '08:00:00',
        close_hour: '23:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Luxury Banquet',
        type: 'Luxury Banquet Hall',
        description: 'Opulent banquet hall with gold accents and crystal fixtures.',
        location: '123 Luxury Lane, Upscale District',
        capacity: 350,
        price: 3000.00,
        open_hour: '11:00:00',
        close_hour: '01:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Startup Space',
        type: 'Startup Meetup Space',
        description: 'Casual meeting space perfect for startup gatherings.',
        location: '456 Startup St, Innovation Hub',
        capacity: 45,
        price: 250.00,
        open_hour: '09:00:00',
        close_hour: '21:00:00',
        owner_id: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('hall', null, {});
  }
};