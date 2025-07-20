const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sequelize = require('./database/sequelize');
const User = require('./model/User');
const Hall = require('./model/Hall');
const Category = require('./model/Category');
const HallCategory = require('./model/HallCategory');
const Image = require('./model/Image');
const Favorite = require('./model/Favorite');

// Import associations to ensure relationships work
require('./model/Association');

const app = express();
const PORT = 5000; // Changed back to 5000
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key'; // Keep it safe

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

// Register
app.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, dob, address, gender, role } = req.body;

  // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      password: hashedPassword,
      dob,
      address,
      gender,
      role: role || 'customer' // Use provided role, fallback to 'customer'
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
  const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Check password
  const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.user_id, 
        email: user.email,
        role: user.role 
      }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/profile', async (req, res) => {
  try {
  const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

  const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        dob: user.dob,
        address: user.address,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Simple test endpoint for venues
app.get('/test/venues', async (req, res) => {
  try {
    const venues = await Hall.findAll({
      limit: 5
    });
    
    res.json({
      count: venues.length,
      venues: venues.map(v => ({
        id: v.hall_id,
        name: v.name,
        type: v.type,
        location: v.location,
        capacity: v.capacity,
        price: v.price
      }))
    });
  } catch (error) {
    console.error('Test venues error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check data
app.get('/debug/venues', async (req, res) => {
  try {
    const venues = await Hall.findAll({
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['url', 'order'],
          required: false
        },
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    const categories = await Category.findAll();
    
    res.json({
      totalVenues: venues.length,
      totalCategories: categories.length,
      categories: categories.map(c => ({ id: c.id, name: c.name })),
      venues: venues.map(v => ({
        id: v.hall_id,
        type: v.type,
        location: v.location,
        imageCount: v.images ? v.images.length : 0,
        categoryCount: v.categories ? v.categories.length : 0,
        categories: v.categories ? v.categories.map(c => c.name) : []
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
  });

// Get all categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all venues with images and categories
app.get('/venues', async (req, res) => {
  try {
    const { category } = req.query;
    
    let includeClause = [
      {
        model: Image,
        as: 'images',
        attributes: ['url', 'order'],
        where: { order: 1 }, // Get only the first image for each venue
        required: false
      }
    ];

    // Add category filter if provided
    if (category) {
      includeClause.push({
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: ['id', 'name'],
        where: { name: category }
      });
    } else {
      // Include categories for all venues when no filter
      includeClause.push({
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: ['id', 'name']
      });
    }

    const venues = await Hall.findAll({
      include: includeClause,
      order: [['created_at', 'DESC']]
    });

    // Transform the data to match frontend expectations
    const transformedVenues = venues.map(venue => ({
      id: venue.hall_id,
      name: venue.name,
      type: venue.type,
      description: venue.description,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      openHour: venue.open_hour,
      closeHour: venue.close_hour,
      image: venue.images && venue.images.length > 0 ? venue.images[0].url : null,
      categories: venue.categories ? venue.categories.map(cat => cat.name) : []
    }));

    res.json(transformedVenues);
  } catch (error) {
    console.error('Venues error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single venue by ID
app.get('/venues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const venue = await Hall.findByPk(id, {
      include: [
        {
          model: Image,
          as: 'images',
          attributes: ['url', 'order'],
          order: [['order', 'ASC']]
        },
        {
          model: Category,
          as: 'categories',
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ]
    });

    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    const transformedVenue = {
      id: venue.hall_id,
      name: venue.name,
      type: venue.type,
      description: venue.description,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      openHour: venue.open_hour,
      closeHour: venue.close_hour,
      images: venue.images ? venue.images.map(img => img.url) : [],
      categories: venue.categories ? venue.categories.map(cat => cat.name) : []
    };

    res.json(transformedVenue);
  } catch (error) {
    console.error('Venue detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// JWT Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Add to favorites
app.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hallId } = req.body;
    if (!hallId) return res.status(400).json({ error: 'hallId is required' });
    // Prevent duplicate
    const [favorite, created] = await Favorite.findOrCreate({
      where: { user_id: userId, hall_id: hallId },
      defaults: { user_id: userId, hall_id: hallId }
    });
    if (!created) {
      return res.status(200).json({ message: 'Already in favorites' });
    }
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove from favorites
app.delete('/favorites/:hallId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const hallId = req.params.hallId;
    const deleted = await Favorite.destroy({ where: { user_id: userId, hall_id: hallId } });
    if (deleted) {
      return res.json({ message: 'Removed from favorites' });
    } else {
      return res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all favorites for user
app.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{ model: Hall, as: 'hall', include: [
        { model: Category, as: 'categories', through: { attributes: [] } },
        { model: Image, as: 'images', attributes: ['url', 'order'] }
      ] }]
    });
    const venues = favorites.map(fav => {
      const hall = fav.hall;
      return hall ? {
        id: hall.hall_id,
        name: hall.name,
        type: hall.type,
        location: hall.location,
        capacity: hall.capacity,
        price: hall.price,
        categories: hall.categories ? hall.categories.map(c => c.name) : [],
        image: hall.images && hall.images.length > 0 ? hall.images[0].url : null
      } : null;
    }).filter(Boolean);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the backend');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});