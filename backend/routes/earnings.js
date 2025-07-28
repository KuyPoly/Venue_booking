const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/weekly', authenticateToken, earningsController.getWeeklyEarnings);

module.exports = router;
