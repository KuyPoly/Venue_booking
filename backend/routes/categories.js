const express = require('express');
const router = express.Router();
const Category = require('../model/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['id', 'name'],
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;
