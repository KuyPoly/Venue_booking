import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './profile.css';

const fetchProfile = async () => {
  try {
    const response = await api.getProfile();
    const data = await response.json();
    if (data.success) {
      return data.profile;
    } else {
      console.error('Failed to fetch profile:', data.message);
      return {
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
          website: ''
        }
      };
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
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
        website: ''
      }
    };
  }
};

const saveProfile = async (profileData) => {
  try {
    const response = await api.updateProfile(profileData);
    const data = await response.json();
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

const Profile = () => {
  const [profile, setProfile] = useState({
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
      website: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile().then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setProfile(prev => ({
        ...prev,
        social: {
          ...prev.social,
          [socialField]: value
        }
      }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await saveProfile(profile);
    if (success) {
      setMessage('Profile saved successfully!');
    } else {
      setMessage('Failed to save profile. Please try again.');
    }
  };

  const handleSocialSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await saveProfile(profile);
    if (success) {
      setMessage('Social links saved successfully!');
    } else {
      setMessage('Failed to save social links. Please try again.');
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
            <div className="profile-avatar-upload" style={{ display: 'none' }}>
            </div>
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
                Display Name
                <input 
                  type="text" 
                  name="displayName"
                  value={profile.displayName}
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
              <label>
                Phone
                <input 
                  type="text" 
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </label>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </section>
          <section className="profile-social">
            <div className="profile-section-header">Social</div>
            <form className="social-form" onSubmit={handleSocialSubmit}>
              <label>
                Twitter
                <input 
                  type="text" 
                  name="social.twitter"
                  value={profile.social.twitter}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                Facebook
                <input 
                  type="text" 
                  name="social.facebook"
                  value={profile.social.facebook}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                Linkedin
                <input 
                  type="text" 
                  name="social.linkedin"
                  value={profile.social.linkedin}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                Instagram
                <input 
                  type="text" 
                  name="social.instagram"
                  value={profile.social.instagram}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                Whatsapp
                <input 
                  type="text" 
                  name="social.whatsapp"
                  value={profile.social.whatsapp}
                  onChange={handleProfileChange}
                />
              </label>
              <label>
                Website
                <input 
                  type="text" 
                  name="social.website"
                  value={profile.social.website}
                  onChange={handleProfileChange}
                />
              </label>
              <button type="submit" className="save-btn">Save Changes</button>
            </form>
          </section>
        </div>
        {message && <div style={{ marginTop: 20, color: '#2563eb', fontWeight: 500 }}>{message}</div>}
      </main>
    </div>
  );
};

export default Profile;
