import React, { useState, useEffect } from 'react';
import './setting.css';
import Sidebar from '../../component/Owner/Sidebar';


const fetchSettings = async () => {
  // Placeholder: fetch user settings from your database
  return {
    language: 'English',
    notification: false,
    privateMode: false,
    darkMode: false,
    locations: false,
  };
};

const saveSettings = async (settings) => {
  // Placeholder: save user settings to your database
  // await api.saveSettings(settings);
};

const changePassword = async (current, newPassword) => {
  // Placeholder: change password in your database
  // await api.changePassword(current, newPassword);
};

const Setting = () => {
  const [settings, setSettings] = useState({
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
    fetchSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    await saveSettings(settings);
    setMessage('Settings saved!');
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
    await changePassword(passwords.current, passwords.new);
    setMessage('Password changed!');
    setPasswords({ current: '', new: '', verify: '' });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="setting-page">
      <Sidebar />
      <main className="setting-main">
        <h1 className="setting-title">Setting</h1>
        <div className="setting-content">
          <section className="setting-card">
            <div className="setting-section-header">General</div>
            <form className="setting-form" onSubmit={handleSave}>
              <label>
                Language
                <select name="language" value={settings.language} onChange={handleChange}>
                  <option value="English">English</option>
                  <option value="Khmer">Khmer</option>
                </select>
              </label>
              <label>
                Notification
                <span className="toggle-switch">
                  <input type="checkbox" checked={settings.notification} onChange={() => handleToggle('notification')} />
                  <span className="toggle-slider"></span>
                </span>
              </label>
              <label>
                Private Mode
                <span className="toggle-switch">
                  <input type="checkbox" checked={settings.privateMode} onChange={() => handleToggle('privateMode')} />
                  <span className="toggle-slider"></span>
                </span>
              </label>
              <label>
                Dark Mode
                <span className="toggle-switch">
                  <input type="checkbox" checked={settings.darkMode} onChange={() => handleToggle('darkMode')} />
                  <span className="toggle-slider"></span>
                </span>
              </label>
              <label>
                Locations
                <span className="toggle-switch">
                  <input type="checkbox" checked={settings.locations} onChange={() => handleToggle('locations')} />
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
      </main>
    </div>
  );
};

export default Setting;
