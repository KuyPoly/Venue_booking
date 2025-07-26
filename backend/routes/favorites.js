const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    // No token provided, continue without user info
    req.user = null;
    return next();
  }
  
  const jwt = require('jsonwebtoken');
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
};

router.post('/favorites', favoriteController.authenticateToken, favoriteController.addFavorite);
router.delete('/favorites/:hallId', favoriteController.authenticateToken, favoriteController.removeFavorite);
router.get('/favorites', optionalAuth, favoriteController.getFavorites);

module.exports = router; 