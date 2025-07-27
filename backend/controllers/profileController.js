// controller/profileController.js
// This controller handles user profile operations without middleware authentication

const User = require('../model/User');

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
  }
};

module.exports = profileController; 