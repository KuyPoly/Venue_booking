/* filepath: d:\y2t3\venue_booking\frontend\src\component\footer\footer.jsx */
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
      <div className="footer__container">
        <div className="footer__section">
          <div
            className="footer__header"
            onClick={() => toggleSection("payment")}
          >
            <h4>Payment & Shipping</h4>
            <span className={`caret ${openSections["payment"] ? "rotated" : ""}`}>
              ▼
            </span>
          </div>
          <div
            className={`footer__links ${
              openSections["payment"] ? "open" : ""
            }`}
          >
            <Link to="/method" className="link-footer">
              Payment Method
            </Link>
          </div>
        </div>

        <div className="footer__section">
          <div
            className="footer__header"
            onClick={() => toggleSection("service")}
          >
            <h4>Customer Service</h4>
            <span className={`caret ${openSections["service"] ? "rotated" : ""}`}>
              ▼
            </span>
          </div>
          <div
            className={`footer__links ${
              openSections["service"] ? "open" : ""
            }`}
          >
            <Link to="/contact" className="link-footer">
              About Us
            </Link>
          </div>
        </div>

        <div className="footer__section">
          <div
            className="footer__header"
            onClick={() => toggleSection("account")}
          >
            <h4>Account</h4>
            <span className={`caret ${openSections["account"] ? "rotated" : ""}`}>
              ▼
            </span>
          </div>
          <div
            className={`footer__links ${
              openSections["account"] ? "open" : ""
            }`}
          >
            <Link to="/sign-up" className="link-footer">Sign Up</Link>
            <Link to="/log-in" className="link-footer">Log In</Link>
            <Link to="/profile" className="link-footer">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}