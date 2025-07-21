// routes/wallet.js
const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

router.get('/', walletController.getWalletInfo);

module.exports = router;
