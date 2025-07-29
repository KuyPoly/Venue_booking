const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/auth');

router.get('/profile', authenticateToken, profileController.getProfile);
router.put('/profile', authenticateToken, profileController.updateProfile);
router.post('/profile/avatar', authenticateToken, profileController.uploadAvatar);
router.put('/change-password', authenticateToken, profileController.changePassword);

module.exports = router;
