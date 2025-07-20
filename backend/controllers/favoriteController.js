const jwt = require('jsonwebtoken');
const Favorite = require('../model/Favorite');
const Hall = require('../model/Hall');
const Category = require('../model/Category');
const Image = require('../model/Image');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { hallId } = req.body;
    if (!hallId) return res.status(400).json({ error: 'hallId is required' });
    const [favorite, created] = await Favorite.findOrCreate({
      where: { user_id: userId, hall_id: hallId },
      defaults: { user_id: userId, hall_id: hallId }
    });
    if (!created) {
      return res.status(200).json({ message: 'Already in favorites' });
    }
    res.status(201).json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const hallId = req.params.hallId;
    const deleted = await Favorite.destroy({ where: { user_id: userId, hall_id: hallId } });
    if (deleted) {
      return res.json({ message: 'Removed from favorites' });
    } else {
      return res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{ model: Hall, as: 'hall', include: [
        { model: Category, as: 'categories', through: { attributes: [] } },
        { model: Image, as: 'images', attributes: ['url', 'order'] }
      ] }]
    });
    const venues = favorites.map(fav => {
      const hall = fav.hall;
      return hall ? {
        id: hall.hall_id,
        name: hall.name,
        type: hall.type,
        location: hall.location,
        capacity: hall.capacity,
        price: hall.price,
        categories: hall.categories ? hall.categories.map(c => c.name) : [],
        image: hall.images && hall.images.length > 0 ? hall.images[0].url : null
      } : null;
    }).filter(Boolean);
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}; 