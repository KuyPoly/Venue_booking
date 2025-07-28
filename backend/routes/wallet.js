// routes/wallet.js
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticateToken } = require('../middleware/auth');

// Apply authentication middleware to all wallet routes
router.use(authenticateToken);

// Get wallet information
router.get('/', walletController.getWalletInfo);

// Get transaction history
router.get('/transactions', walletController.getTransactionHistory);

// Process withdrawal
router.post('/withdraw', walletController.withdrawFunds);

// Credit wallet (API endpoint for testing/manual credit)
router.post('/credit', walletController.creditWalletAPI);

// Get wallet statistics
router.get('/stats', walletController.getWalletStats);

module.exports = router;
