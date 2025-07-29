const { User } = require('../model/Association');
const bcrypt = require('bcryptjs');

const profileController = {
  // Get user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.user_id; // Get user ID from authenticated request
      
      console.log('=== GET PROFILE DEBUG ===');
      console.log('Authenticated user ID:', userId);
      console.log('Request user:', req.user);
      
      // Find user by ID
      const user = await User.findByPk(userId, {
        attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone_number', 'address', 'role', 'created_at', 'dob', 'gender']
      });

      if (!user) {
        console.log('User not found for ID:', userId);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      console.log('Found user:', user.toJSON());

      // Map database fields to frontend format
      const profile = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        displayName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
        email: user.email || '',
        phone: user.phone_number || '',
        aboutMe: user.address || '', // Using address field as aboutMe for now
        role: user.role || '',
        memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString() : '',
        dateOfBirth: user.dob || '',
        gender: user.gender || '',
        social: {
          twitter: '',
          facebook: '',
          linkedin: '',
          instagram: '',
          whatsapp: user.phone_number || '',
          website: ''
        }
      };
      
      console.log('✅ Returning profile:', profile);
      
      res.json({
        success: true,
        profile: profile
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
      const userId = req.user.user_id; // Get user ID from authenticated request
      const { firstName, lastName, email, phone, aboutMe } = req.body;
      
      console.log('=== UPDATE PROFILE DEBUG ===');
      console.log('User ID:', userId);
      console.log('Update data:', { firstName, lastName, email, phone, aboutMe });
      
      // Find user by ID
      const user = await User.findByPk(userId);

      if (!user) {
        console.log('User not found for ID:', userId);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Update user fields (only update provided fields)
      if (firstName !== undefined) user.first_name = firstName;
      if (lastName !== undefined) user.last_name = lastName;
      if (email !== undefined) user.email = email;
      if (phone !== undefined) user.phone_number = phone;
      if (aboutMe !== undefined) user.address = aboutMe; // Using address field as aboutMe for now

      // Save changes
      await user.save();
      
      console.log('✅ User updated successfully');
      
      // Return updated profile
      const updatedProfile = {
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        displayName: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0],
        email: user.email || '',
        phone: user.phone_number || '',
        aboutMe: user.address || '',
        role: user.role || '',
        memberSince: user.created_at ? new Date(user.created_at).toLocaleDateString() : ''
      };
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        profile: updatedProfile
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
      const userId = req.user.user_id; // Get user ID from authenticated request
      const { current, new: newPassword, confirm } = req.body;

      console.log('=== CHANGE PASSWORD DEBUG ===');
      console.log('User ID:', userId);
      console.log('Has current password:', !!current);
      console.log('Has new password:', !!newPassword);
      console.log('Has confirm password:', !!confirm);

      if (!current || !newPassword || !confirm) {
        return res.status(400).json({ success: false, message: 'Please provide all password fields.' });
      }

      if (newPassword !== confirm) {
        return res.status(400).json({ success: false, message: 'New passwords do not match.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
      }

      // Find user by ID
      const user = await User.findByPk(userId);
      if (!user) {
        console.log('User not found for ID:', userId);
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      console.log('Found user for password change');

      // Verify current password
      const isMatch = await bcrypt.compare(current, user.password);
      if (!isMatch) {
        console.log('Current password verification failed');
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      console.log('Current password verified successfully');

      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password = hashedPassword;
      await user.save();

      console.log('✅ Password changed successfully');

      return res.json({ success: true, message: 'Password changed successfully.' });
    } catch (error) {
      console.error('Error changing password:', error);
      return res.status(500).json({ success: false, message: 'Failed to change password.', error: error.message });
    }
  }
};

module.exports = profileController;
