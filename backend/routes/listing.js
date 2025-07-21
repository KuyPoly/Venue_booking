// routes/listing.js
const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

router.get('/', listingController.getAllListings);
router.get('/:id', listingController.getListingById);
router.post('/', listingController.createListing);
router.put('/:id', listingController.updateListing);
router.delete('/:id', listingController.deleteListing);

module.exports = router;
