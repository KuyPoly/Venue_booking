const express = require('express');
const router = express.Router();
const { Hall, Image, Category } = require('../model');

router.get('/', async (req, res) => {
  try {
    const { name, location, type, capacity, priceMin, priceMax, features } = req.query;
    const where = {};
    if (name) where.name = { $like: `%${name}%` };
    if (location) where.location = location;
    if (type) where.type = type;
    if (capacity) where.capacity = { $gte: Number(capacity) };
    if (priceMin) where.price = { ...where.price, $gte: Number(priceMin) };
    if (priceMax) where.price = { ...where.price, $lte: Number(priceMax) };
    // Add features filter if needed

    const venues = await Hall.findAll({
      where,
      include: [
        { model: Image, as: 'images' },
        { model: Category, as: 'categories', through: { attributes: [] } }
      ],
    });

    const formatted = venues.map(v => ({
      id: v.hall_id,
      name: v.name,
      location: v.location,
      capacity: v.capacity,
      price: v.price,
      imageUrl: v.images?.[0]?.url,
      categories: v.categories?.map(c => c.name) || [],
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
