const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.profile);
router.post('/become-owner', auth, authController.becomeOwner);

module.exports = router; 