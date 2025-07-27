const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import database
const sequelize = require('./database/sequelize');

// Import associations - CRITICAL: This must be imported before any model usage
require('./model/Association');

// Import routes
const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const listingRoutes = require('./routes/listing');
const favoriteRoutes = require('./routes/favorites');
const bookingsRoutes = require('./routes/booking');
const paymentsRoutes = require('./routes/payments');
const venueSearchRoutes = require('./routes/venueSearch');
const settingRoutes = require('./routes/setting');
const profileRoutes = require('./routes/profile');
// Import settings routes



// Import additional routes
const bookingRoutes = require('./routes/booking-history');
const categoryRoutes = require('./routes/categories');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes - Fix the mounting paths
app.use('/', authRoutes);
app.use('/', venueRoutes);
app.use('/api/listings', listingRoutes);
app.use('/', favoriteRoutes);

// Add missing routes
app.use('/bookings', bookingRoutes);
app.use('/booking', bookingRoutes); // For booking stats
app.use('/categories', categoryRoutes);
app.use('/listing', listingRoutes); // For dashboard compatibility

app.use('/api/setting', settingRoutes);
app.use('/api/profile', profileRoutes);
// Test route
app.get('/', (req, res) => {
  res.send('Venue Booking API is running!');
});

// Test database connection and sync
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ force: false });
    console.log('Database synced');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}
app.use(authRoutes);
app.use(venueRoutes);
app.use(favoriteRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/payments', paymentsRoutes);
app.use('/venuesearch', venueSearchRoutes);

startServer();