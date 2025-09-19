// Filename: src/components/Header.jsx

import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import '../styles/Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="header-profile">
        <FaBell className="notification-icon" />
        <div className="profile-avatar"></div>
      </div>
    </header>
  );
};