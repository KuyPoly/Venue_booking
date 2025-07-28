const express = require('express');
const router = express.Router();
const earningsController = require('../controllers/earningsController');

router.get('/weekly', earningsController.getWeeklyEarnings);

module.exports = router;
