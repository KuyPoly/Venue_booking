import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      section: 'MAIN',
      items: [
        { to: '/dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { to: '/dashboard/bookings', label: 'Bookings', icon: 'fas fa-calendar-check' },
        { to: '/dashboard/listings', label: 'My Listings', icon: 'fas fa-home' },
        { to: '/dashboard/wallet', label: 'Wallet', icon: 'fas fa-wallet' },
      ],
    },
    {
      section: 'ACCOUNT',
      items: [
        { to: '/dashboard/profile', label: 'My Profile', icon: 'fas fa-user' },
        { to: '/dashboard/settings', label: 'Setting', icon: 'fas fa-cog' },
        {
          isButton: true,
          label: 'Log Out',
          icon: 'fas fa-sign-out-alt',
          onClick: () => {
            localStorage.removeItem('token');
            window.location.href = '/';
          },
        },
      ],
    },
  ];

  return (
    <nav className="sidebar">
      <div className="logo">WEBNAME</div>
      {menuItems.map((section, index) => (
        <div key={index}>
          <div className="section-title">{section.section}</div>
          <ul>
            {section.items.map((item, idx) => {
              const isActive = location.pathname === item.to;
              return item.isButton ? (
                <li key={idx}>
                  <button className="logout-btn" onClick={item.onClick}>
                    <i className={`${item.icon} icon`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              ) : (
                <li key={idx} className={isActive ? 'active' : ''}>
                  <Link to={item.to}>
                    <i className={`${item.icon} icon`} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
