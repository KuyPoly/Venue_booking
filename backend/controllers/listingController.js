// controllers/listingController.js
const Listing = require('../model/Listing');

exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.getAll();
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.getById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
};

exports.createListing = async (req, res) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create listing' });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const success = await Listing.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update listing' });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const success = await Listing.remove(req.params.id);
    if (!success) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing' });
  }
};
