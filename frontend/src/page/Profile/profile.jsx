import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import './profile.css';

const fetchProfile = async () => {
  try {
    console.log('Fetching profile...');
    const response = await api.getProfile();
    console.log('Profile response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Profile fetch error:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Profile data received:', data);
    
    if (data.success) {
      return data.profile;
    } else {
      console.error('Failed to fetch profile:', data.message);
      return getEmptyProfile();
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return getEmptyProfile();
  }
};

const saveProfile = async (profileData) => {
  try {
    console.log('Saving profile data:', profileData);
    const response = await api.updateProfile(profileData);
    console.log('Update response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Profile update error:', response.status, errorText);
      return false;
    }
    
    const data = await response.json();
    console.log('Update response data:', data);
    
    if (data.success) {
      console.log('Profile saved successfully');
      return true;
    } else {
      console.error('Failed to save profile:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

const changePassword = async (passwords) => {
  try {
    console.log('Attempting password change...');
    const response = await api.changePassword(passwords);
    console.log('Password change response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Password change error:', response.status, errorText);
      return { success: false, message: `Error: ${errorText}` };
    }
    
    const data = await response.json();
    console.log('Password change response:', data);
    return data;
  } catch (error) {
    console.error('Password change error:', error);
    return { success: false, message: 'An error occurred while changing the password.' };
  }
};

const getEmptyProfile = () => ({
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  phone: '',
  aboutMe: '',
  social: {
    twitter: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    whatsapp: '',
    website: '',
  },
});

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(getEmptyProfile());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        console.log('No user found, redirecting to login...');
        window.location.href = '/';
        return;
      }
      
      console.log('Loading profile for user:', user);
      const data = await fetchProfile();
      setProfile(data);
      setLoading(false);
    };
    
    loadProfile();
  }, [user]);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setProfile((prev) => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value,
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    const success = await saveProfile(profile);
    if (success) {
      showMessage('Profile saved successfully!', 'success');
    } else {
      showMessage('Failed to save profile. Please try again.', 'error');
    }
    
    setSaving(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setMessage('');

    if (passwords.new !== passwords.confirm) {
      showMessage('New passwords do not match.', 'error');
      setChangingPassword(false);
      return;
    }

    if (passwords.new.length < 6) {
      showMessage('New password must be at least 6 characters long.', 'error');
      setChangingPassword(false);
      return;
    }

    const data = await changePassword(passwords);
    if (data.success) {
      showMessage('Password updated successfully!', 'success');
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      showMessage(data.message || 'Failed to update password.', 'error');
    }
    
    setChangingPassword(false);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div style={{ fontSize: '2rem', marginBottom: '16px' }}>👤</div>
          Loading your profile...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <main className="profile-main">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.firstName ? profile.firstName.charAt(0).toUpperCase() : '👤'}
            </div>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-title">
              {profile.displayName || `${profile.firstName} ${profile.lastName}`.trim() || 'User Profile'}
            </h1>
            <p className="profile-subtitle">
              {profile.role === 'owner' ? ' Venue Owner' : ' Customer'} • 
              Member since {profile.memberSince || 'N/A'}
            </p>
          </div>
        </div>

        <div className="profile-content">
          <section className="profile-details">
            <div className="profile-section-header">
              <h2> Profile Details</h2>
              <p>Update your personal information below</p>
            </div>
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <div className="form-row">
                <label className="form-label">
                  First Name
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="Enter your first name"
                  />
                </label>
                <label className="form-label">
                  Last Name
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleProfileChange}
                    className="form-input"
                    placeholder="Enter your last name"
                  />
                </label>
              </div>
              
              <label className="form-label">
                Email Address
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="Enter your email address"
                />
              </label>
              
              <label className="form-label">
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                  className="form-input"
                  placeholder="Enter your phone number"
                />
              </label>
              
              <label className="form-label">
                About Me
                <textarea
                  name="aboutMe"
                  value={profile.aboutMe}
                  onChange={handleProfileChange}
                  className="form-textarea"
                  rows="4"
                  placeholder="Tell us a bit about yourself..."
                />
              </label>
              
              <button 
                type="submit" 
                className={`save-btn ${saving ? 'saving' : ''}`}
                disabled={saving}
              >
                {saving ? ' Saving...' : ' Save Changes'}
              </button>
            </form>
          </section>

          <section className="change-password-section">
            <div className="profile-section-header">
              <h2> Change Password</h2>
              <p>Update your account password for security</p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <label className="form-label">
                Current Password
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Enter your current password"
                  required
                />
              </label>
              <label className="form-label">
                New Password
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Enter your new password (min 6 characters)"
                  required
                  minLength="6"
                />
              </label>
              <label className="form-label">
                Confirm New Password
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  className="form-input"
                  placeholder="Confirm your new password"
                  required
                  minLength="6"
                />
              </label>
              <button 
                type="submit" 
                className={`save-btn password-btn ${changingPassword ? 'saving' : ''}`}
                disabled={changingPassword}
              >
                {changingPassword ? ' Updating...' : ' Update Password'}
              </button>
            </form>
          </section>
        </div>
        
        {message && (
          <div className={`message ${messageType}`}>
            <span className="message-icon">
              {messageType === 'success' ? '✅' : '❌'}
            </span>
            {message}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
