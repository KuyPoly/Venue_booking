const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);

// Use multer middleware for create and update routes
router.post('/', authenticateToken, listingController.uploadImages, listingController.createListing);
router.put('/:id', authenticateToken, listingController.uploadImages, listingController.updateListing);

router.delete('/:id', authenticateToken, listingController.deleteListing);

module.exports = router;