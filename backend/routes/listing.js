const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);

// Use multer middleware for create and update routes
router.post('/', listingController.uploadImages, listingController.createListing);
router.put('/:id', listingController.uploadImages, listingController.updateListing);

router.delete('/:id', listingController.deleteListing);

module.exports = router;