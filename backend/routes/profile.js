// routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Profile routes without middleware
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.post('/profile/avatar', profileController.uploadAvatar);

module.exports = router; 