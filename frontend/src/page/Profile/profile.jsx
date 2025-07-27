import React from 'react';
import './profile.css';
import Sidebar from '../../component/Owner/Sidebar';



const Profile = () => (
  <div className="profile-page">
    <Sidebar />
    <main className="profile-main">
      <h1 className="profile-title">My Profile</h1>
      <div className="profile-content">
        <section className="profile-details">
          <div className="profile-section-header">Profile Details</div>
          <div className="profile-avatar-upload">
            <div className="avatar-placeholder">Upload Avatar</div>
          </div>
          <form className="profile-form">
            <label>First Name<input type="text" /></label>
            <label>Last Name<input type="text" /></label>
            <label>Display Name<input type="text" /></label>
            <label>E-Mail<input type="email" /></label>
            <label>Phone<input type="text" /></label>
            <label>About me<textarea /></label>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </section>
        <section className="profile-social">
          <div className="profile-section-header">Social</div>
          <form className="social-form">
            <label>Twitter<input type="text" /></label>
            <label>Facebook<input type="text" /></label>
            <label>Linkedin<input type="text" /></label>
            <label>Instagram<input type="text" /></label>
            <label>Whatsapp<input type="text" /></label>
            <label>Website<input type="text" /></label>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </section>
      </div>
    </main>
  </div>
);

export default Profile;
