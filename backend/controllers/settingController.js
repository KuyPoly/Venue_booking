// controllers/settingsController.js
const User = require('../model/User'); // Adjust path/model as needed
const bcrypt = require('bcryptjs');

// Get user settings
exports.getSetting = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you use JWT/auth middleware
    const user = await User.findById(userId).select('settings');
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user settings
exports.updateSetting = async (req, res) => {
  try {
    const userId = req.user.id;
    const { language, notification, privateMode, darkMode, locations } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        settings: { language, notification, privateMode, darkMode, locations }
      },
      { new: true }
    );
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current, newPassword } = req.body;
    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(current, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
