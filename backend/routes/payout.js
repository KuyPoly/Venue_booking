const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');
const { authenticateToken } = require('../middleware/auth');

router.get('/history', authenticateToken, payoutController.getPayoutHistory);

module.exports = router;
