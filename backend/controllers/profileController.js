const User = require('../model/User');
const bcrypt = require('bcrypt');

const profileController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      // For now, return default profile data
      // In a real app, you would get the user ID from the request and fetch their profile
      const defaultProfile = {
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'johndoe',
        email: 'john@example.com',
        phone: '+1234567890',
        aboutMe: 'This is a sample profile.',
        social: {
          twitter: '',
          facebook: '',
          linkedin: '',
          instagram: '',
          whatsapp: '',
          website: ''
        }
      };
      
      res.json({
        success: true,
        profile: defaultProfile
      });
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get profile',
        error: error.message
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const { firstName, lastName, displayName, email, phone, aboutMe, social } = req.body;
      
      // For now, just return success
      // In a real app, you would save this data to the database
      console.log('Profile to update:', { firstName, lastName, displayName, email, phone, aboutMe, social });
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        profile: { firstName, lastName, displayName, email, phone, aboutMe, social }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
        error: error.message
      });
    }
  },

  // Upload avatar
  uploadAvatar: async (req, res) => {
    try {
      // For now, just return success
      // In a real app, you would handle file upload and save the image URL
      console.log('Avatar upload requested');
      
      res.json({
        success: true,
        message: 'Avatar uploaded successfully',
        avatarUrl: 'https://via.placeholder.com/150'
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload avatar',
        error: error.message
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      // TODO: Replace this with your actual authenticated user ID logic
      const userId = 'some-user-id'; // Replace with your auth system

      const { current, new: newPassword, confirm } = req.body;

      if (!current || !newPassword || !confirm) {
        return res.status(400).json({ success: false, message: 'Please provide all password fields.' });
      }

      if (newPassword !== confirm) {
        return res.status(400).json({ success: false, message: 'New passwords do not match.' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(current, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      user.password = hashedPassword;
      await user.save();

      return res.json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ success: false, message: 'Failed to change password.', error: error.message });
    }
  }
};

module.exports = profileController;
