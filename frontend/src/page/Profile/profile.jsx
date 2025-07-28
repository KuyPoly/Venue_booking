import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './profile.css';

const fetchProfile = async () => {
  try {
    const data = await api.getProfile();
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
    const data = await api.updateProfile(profileData);
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
    const data = await api.changePassword(passwords);
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
  const [profile, setProfile] = useState(getEmptyProfile());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

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
    setMessage('');
    const success = await saveProfile(profile);
    setMessage(success ? 'Profile saved successfully!' : 'Failed to save profile. Please try again.');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwords.new !== passwords.confirm) {
      setMessage('New passwords do not match.');
      return;
    }

    const data = await changePassword(passwords);
    if (data.success) {
      setMessage('Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } else {
      setMessage(data.message || 'Failed to update password.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <main className="profile-main">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-content">
          <section className="profile-details">
            <div className="profile-section-header">Profile Details</div>
            <form className="profile-form" onSubmit={handleProfileSubmit}>
              <label>
                First Name
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                Last Name
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                E-Mail
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </label>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </section>

          <section className="change-password-section">
            <div className="profile-section-header">Change Password</div>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <label>
                Current Password
                <input
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handlePasswordChange}
                />
              </label>
              <label>
                Verify New Password
                <input
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                />
              </label>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </section>
        </div>
        {message && (
          <div style={{ marginTop: 20, color: '#2563eb', fontWeight: 500 }}>{message}</div>
        )}
      </main>
    </div>
  );
};

export default Profile;
