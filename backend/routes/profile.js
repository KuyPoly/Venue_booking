const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.post('/profile/avatar', profileController.uploadAvatar);

router.post('/change-password', profileController.changePassword);

module.exports = router;
