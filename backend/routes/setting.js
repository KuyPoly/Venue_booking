// routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController'); // Fixed path

// Routes without middleware
router.get('/setting', settingController.getSetting);
router.put('/setting', settingController.updateSetting);
router.post('/setting/change-password', settingController.changePassword);

module.exports = router;
