const express = require('express');
const favoriteController = require('../controllers/favoriteController');
const router = express.Router();

router.post('/favorites', favoriteController.authenticateToken, favoriteController.addFavorite);
router.delete('/favorites/:hallId', favoriteController.authenticateToken, favoriteController.removeFavorite);
router.get('/favorites', favoriteController.authenticateToken, favoriteController.getFavorites);

module.exports = router; 