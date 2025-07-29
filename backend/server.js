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
const SettingRoutes = require('./routes/setting');
const dashboardRoutes = require('./routes/dashboard');
const ProfileRoutes = require('./routes/profile');
const bookingManagementRoutes = require('./routes/booking-management');
const walletRoutes = require('./routes/wallet');

// Import additional routes
const bookingHistoryRoutes = require('./routes/booking-history');
const categoryRoutes = require('./routes/categories');

// Middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://venuebooking-production.up.railway.app'
    ];
    
    // Allow any Vercel deployment from your account
    const isVercelDomain = origin.includes('kuypolys-projects.vercel.app');
    const isAllowedOrigin = allowedOrigins.includes(origin);
    
    if (isAllowedOrigin || isVercelDomain) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision']
};

app.use(cors(corsOptions));

// Additional CORS headers for preflight requests
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes - Fix the mounting paths
app.use('/api/auth', authRoutes);
app.use('/', venueRoutes);
app.use('/api/listings', listingRoutes);
app.use('/', favoriteRoutes);

// Add missing routes
app.use('/bookings', bookingHistoryRoutes);
app.use('/booking', bookingsRoutes); // For booking stats
app.use('/categories', categoryRoutes);
app.use('/listing', listingRoutes); // For dashboard compatibility

app.use('/api/setting', SettingRoutes);
app.use('/profile', ProfileRoutes); // For profile management
app.use('/api/dashboard', dashboardRoutes);
app.use('/booking-management', bookingManagementRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/payments', paymentsRoutes);
app.use('/venuesearch', venueSearchRoutes);

app.use('/activities', require('./routes/activity'));
app.use('/earnings', require('./routes/earnings'));
app.use('/payouts', require('./routes/payout'));

// Test route
app.get('/', (req, res) => {
  res.send('Venue Booking API is running!');
});

// Test database connection and sync
async function startServer() {
  try {
    // Start the server first
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Then try to connect to database
    try {
      await sequelize.authenticate();
      console.log('Database connected successfully');
      
      // Use alter: true instead of force: false to handle new models gracefully
      await sequelize.sync({ alter: true });
      console.log('Database synced successfully');
    } catch (dbError) {
      console.error('Database connection/sync failed:', dbError.message);
      console.log('Server is running but database features may be limited');
      
      // Try to sync without the problematic tables
      try {
        await sequelize.sync({ force: false });
        console.log('Database synced with existing tables only');
      } catch (syncError) {
        console.error('Basic database sync also failed:', syncError.message);
      }
    }
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();