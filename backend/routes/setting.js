// routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController'); // Fixed path

// Routes without middleware
router.get('/settings', settingController.getSettings);
router.put('/settings', settingController.updateSettings);
router.post('/settings/change-password', settingController.changePassword);

module.exports = router;
