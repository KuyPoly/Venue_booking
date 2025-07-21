const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./database/sequelize');
require('./model/Association');

const bookingRoutes = require('./routes/booking');
const listingRoutes = require('./routes/listing');
const walletRoutes = require('./routes/wallet');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sync database
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

// Import routers
const authRoutes = require('./routes/auth');
const venueRoutes = require('./routes/venues');
const favoriteRoutes = require('./routes/favorites');
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');

// Use routers
app.use('/', (req, res, next) => {
  if (req.path === '/') {
    return res.send('Hello from the backend');
  }
  next();
});

app.use(authRoutes);
app.use(venueRoutes);
app.use(favoriteRoutes);
app.use('/bookings', bookingsRoutes);
app.use('/payments', paymentsRoutes);

// Owner Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/wallet', walletRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});