import React, { useState, useEffect } from 'react';
import './setting.css';

const fetchSetting = async () => {
  try {
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';
    const response = await fetch(`${apiUrl}/api/setting/Setting`);
    const data = await response.json();
    if (data.success) {
      return data.Setting;
    } else {
      console.error('Failed to fetch Setting:', data.message);
      return {
        language: 'English',
        notification: false,
        privateMode: false,
        darkMode: false,
        locations: false,
      };
    }
  } catch (error) {
    console.error('Error fetching Setting:', error);
    return {
      language: 'English',
      notification: false,
      privateMode: false,
      darkMode: false,
      locations: false,
    };
  }
};

const saveSetting = async (Setting) => {
  try {
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';
    const response = await fetch(`${apiUrl}/api/setting/Setting`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Setting),
    });
    const data = await response.json();
    if (data.success) {
      console.log('Setting saved successfully');
      return true;
    } else {
      console.error('Failed to save Setting:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error saving Setting:', error);
    return false;
  }
};

const changePassword = async (current, newPassword) => {
  try {
    const apiUrl = process.env.REACT_APP_API_BASE_URL || 'https://venuebooking-production.up.railway.app';
    const response = await fetch(`${apiUrl}/api/setting/Setting/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: current,
        newPassword: newPassword,
      }),
    });
    const data = await response.json();
    if (data.success) {
      console.log('Password changed successfully');
      return true;
    } else {
      console.error('Failed to change password:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
};

const Setting = () => {
  const [Setting, setSetting] = useState({
    language: 'English',
    notification: false,
    privateMode: false,
    darkMode: false,
    locations: false,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    verify: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSetting().then(data => {
      setSetting(data);
      setLoading(false);
    });
  }, []);

  const handleToggle = (key) => {
    setSetting(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    const success = await saveSetting(Setting);
    if (success) {
      setMessage('Setting saved successfully!');
    } else {
      setMessage('Failed to save Setting. Please try again.');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (passwords.new !== passwords.verify) {
      setMessage('New passwords do not match.');
      return;
    }
    const success = await changePassword(passwords.current, passwords.new);
    if (success) {
      setMessage('Password changed successfully!');
      setPasswords({ current: '', new: '', verify: '' });
    } else {
      setMessage('Failed to change password. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="setting-container">
      <h1 className="setting-title">Setting</h1>
      <div className="setting-content">
        <section className="setting-card">
          <div className="setting-section-header">General</div>
          <form className="setting-form" onSubmit={handleSave}>
            <label>
              Language
              <select name="language" value={Setting.language} onChange={handleChange}>
                <option value="English">English</option>
                <option value="Khmer">Khmer</option>
              </select>
            </label>
            <label>
              Notification
              <span className="toggle-switch">
                <input type="checkbox" checked={Setting.notification} onChange={() => handleToggle('notification')} />
                <span className="toggle-slider"></span>
              </span>
            </label>
            <label>
              Private Mode
              <span className="toggle-switch">
                <input type="checkbox" checked={Setting.privateMode} onChange={() => handleToggle('privateMode')} />
                <span className="toggle-slider"></span>
              </span>
            </label>
            <label>
              Dark Mode
              <span className="toggle-switch">
                <input type="checkbox" checked={Setting.darkMode} onChange={() => handleToggle('darkMode')} />
                <span className="toggle-slider"></span>
              </span>
            </label>
            <label>
              Locations
              <span className="toggle-switch">
                <input type="checkbox" checked={Setting.locations} onChange={() => handleToggle('locations')} />
                <span className="toggle-slider"></span>
              </span>
            </label>
            <label>
              Close Account
              <button className="close-account-btn" disabled>Close Account &gt;</button>
            </label>
            <button type="submit" className="setting-btn">Save Changes</button>
          </form>
        </section>
        <section className="setting-card">
          <div className="setting-section-header">Changes Password</div>
          <form className="setting-form" onSubmit={handlePasswordSubmit}>
            <label>
              Current Password
              <input type="password" name="current" value={passwords.current} onChange={handlePasswordChange} />
            </label>
            <label>
              New Password
              <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} />
            </label>
            <label>
              Verify New Password
              <input type="password" name="verify" value={passwords.verify} onChange={handlePasswordChange} />
            </label>
            <button type="submit" className="setting-btn">Save Changes</button>
          </form>
        </section>
      </div>
      {message && <div style={{ marginTop: 20, color: '#2563eb', fontWeight: 500 }}>{message}</div>}
    </div>
  );
};

export default Setting;
