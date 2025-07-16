import React, { useState } from "react";
import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <footer className="footer">
      <div className="footer__section">
        <h4>Payment & Shipping</h4>
        <div className="footer__links">
          <Link to="/method" className="link-footer">Payment Method</Link>
        </div>
      </div>

      <div className="footer__section">
        <h4>Customer Service</h4>
        <div className="footer__links">
          <Link to="/contact" className="link-footer">About Us</Link>
        </div>
      </div>

      <div className="footer__section">
        <h4>Account</h4>
        <div className="footer__links">
          <Link to="/sign-up" className="link-footer">Sign Up</Link>
          <Link to="/log-in" className="link-footer">Log In</Link>
          <Link to="/profile" className="link-footer">Profile</Link>
        </div>
      </div>

    </footer>
  );
}