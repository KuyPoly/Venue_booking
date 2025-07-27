const User = require('../model/User');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('firstName lastName displayName email phone about social avatar');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, displayName, email, phone, about, social, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, displayName, email, phone, about, social, avatar },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};