const Hall = require('../model/Hall');
const Category = require('../model/Category');
const Image = require('../model/Image');

exports.testVenues = async (req, res) => {
  try {
    const venues = await Hall.findAll({ limit: 5 });
    res.json({
      count: venues.length,
      venues: venues.map(v => ({
        id: v.hall_id,
        name: v.name,
        type: v.type,
        location: v.location,
        capacity: v.capacity,
        price: v.price
      }))
    });
  } catch (error) {
    console.error('Test venues error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.debugVenues = async (req, res) => {
  try {
    const venues = await Hall.findAll({
      include: [
        { model: Image, as: 'images', attributes: ['url', 'order'], required: false },
        { model: Category, as: 'categories', through: { attributes: [] }, attributes: ['id', 'name'] }
      ]
    });
    const categories = await Category.findAll();
    res.json({
      totalVenues: venues.length,
      totalCategories: categories.length,
      categories: categories.map(c => ({ id: c.id, name: c.name })),
      venues: venues.map(v => ({
        id: v.hall_id,
        type: v.type,
        location: v.location,
        imageCount: v.images ? v.images.length : 0,
        categoryCount: v.categories ? v.categories.length : 0,
        categories: v.categories ? v.categories.map(c => c.name) : []
      }))
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVenues = async (req, res) => {
  try {
    const { category } = req.query;
    let includeClause = [
      { model: Image, as: 'images', attributes: ['url', 'order'], where: { order: 1 }, required: false }
    ];
    if (category) {
      includeClause.push({
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: ['id', 'name'],
        where: { name: category }
      });
    } else {
      includeClause.push({
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        attributes: ['id', 'name']
      });
    }
    const venues = await Hall.findAll({
      include: includeClause,
      order: [['created_at', 'DESC']]
    });
    const transformedVenues = venues.map(venue => ({
      id: venue.hall_id,
      name: venue.name,
      type: venue.type,
      description: venue.description,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      openHour: venue.open_hour,
      closeHour: venue.close_hour,
      image: venue.images && venue.images.length > 0 ? venue.images[0].url : null,
      categories: venue.categories ? venue.categories.map(cat => cat.name) : []
    }));
    res.json(transformedVenues);
  } catch (error) {
    console.error('Venues error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVenueById = async (req, res) => {
  try {
    const { id } = req.params;
    const venue = await Hall.findByPk(id, {
      include: [
        { model: Image, as: 'images', attributes: ['url', 'order'], order: [['order', 'ASC']] },
        { model: Category, as: 'categories', through: { attributes: [] }, attributes: ['id', 'name'] }
      ]
    });
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    const transformedVenue = {
      id: venue.hall_id,
      name: venue.name,
      type: venue.type,
      description: venue.description,
      location: venue.location,
      capacity: venue.capacity,
      price: venue.price,
      openHour: venue.open_hour,
      closeHour: venue.close_hour,
      images: venue.images ? venue.images.map(img => img.url) : [],
      categories: venue.categories ? venue.categories.map(cat => cat.name) : []
    };
    res.json(transformedVenue);
  } catch (error) {
    console.error('Venue detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 