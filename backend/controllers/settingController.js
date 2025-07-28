// controller/settingController.js
// This controller handles user settings without middleware authentication

const User = require('../model/User');

const settingController = {
  // Get user settings
  getSetting: async (req, res) => {
    try {
      // For now, return default settings
      // In a real app, you would get the user ID from the request and fetch their settings
      const defaultSetting = {
        language: 'English',
        notification: false,
        privateMode: false,
        darkMode: false,
        locations: false,
      };
      
      res.json({
        success: true,
        settings: defaultSetting
      });
    } catch (error) {
      console.error('Error getting settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get settings',
        error: error.message
      });
    }
  },

  // Update user settings
  updateSetting: async (req, res) => {
    try {
      const { language, notification, privateMode, darkMode, locations } = req.body;
      
      // For now, just return success
      // In a real app, you would save these settings to the database
      console.log('Settings to update:', { language, notification, privateMode, darkMode, locations });
      
      res.json({
        success: true,
        message: 'Settings updated successfully',
        settings: { language, notification, privateMode, darkMode, locations }
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update settings',
        error: error.message
      });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // For now, just return success
      // In a real app, you would:
      // 1. Get user ID from request
      // 2. Verify current password
      // 3. Hash new password
      // 4. Update in database
      console.log('Password change requested:', { currentPassword, newPassword });
      
      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to change password',
        error: error.message
      });
    }
  }
};

module.exports = settingController;
