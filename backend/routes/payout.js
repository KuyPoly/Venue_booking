const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');

router.get('/history', payoutController.getPayoutHistory);

module.exports = router;
