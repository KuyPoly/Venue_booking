const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./database/sequelize');
// Import associations to ensure relationships work
require('./model/Association');
// Import Owner Dashboard
const bookingRoutes = require('./routes/booking');
const messageRoutes = require('./routes/message');
const listingRoutes = require('./routes/listing');
const walletRoutes = require('./routes/wallet');


const app = express();
const PORT = 5000; // Changed back to 5000

app.use(cors());
app.use(express.json());

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
app.use('/payments', paymentsRoutes); // Handles /payments

// Use routers
app.use('/', (req, res, next) => {
  if (req.path === '/') {
    return res.send('Hello from the backend');
  }
  next();
});
app.use(authRoutes); // Handles /register, /login, /profile
app.use(venueRoutes); // Handles /venues, /categories, etc.
app.use(favoriteRoutes); // Handles /favorites
app.use('/bookings', bookingsRoutes); // Handles /bookings

// Owner Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/wallet', walletRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});