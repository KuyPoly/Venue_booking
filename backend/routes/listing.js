const express = require('express');
const router = express.Router();
const { Listing } = require('../model/Association'); // Adjust path as needed

// GET /listing?owner_id=123 - Get listings by owner
router.get('/', async (req, res) => {
  try {
    const { owner_id } = req.query;
    
    if (!owner_id) {
      return res.status(400).json({ error: 'owner_id is required' });
    }

    const listings = await Listing.findAll({
      where: { ownerId: owner_id },
      attributes: ['id', 'title', 'description', 'price', 'status', 'createdAt']
    });

    res.json({ 
      listings: listings,
      count: listings.length 
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// GET /listing/:id - Get specific listing
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByPk(id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({ listing });
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// POST /listing - Create new listing
router.post('/', async (req, res) => {
  try {
    const listingData = req.body;
    const newListing = await Listing.create(listingData);
    res.status(201).json({ listing: newListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// PUT /listing/:id - Update listing
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const listing = await Listing.findByPk(id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await listing.update(updateData);
    res.json({ listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// DELETE /listing/:id - Delete listing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByPk(id);
    
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    await listing.destroy();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

module.exports = router; 