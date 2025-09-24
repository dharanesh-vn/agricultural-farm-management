import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';
import '../styles/Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-search">
        <FaSearch className="search-icon" />
        {/* --- THIS IS THE FIX --- */}
        <input
          id="header-search"
          name="header-search"
          type="text"
          placeholder="Search..."
        />
        {/* --- END OF FIX --- */}
      </div>
      <div className="header-profile">
        <FaBell className="notification-icon" />
        <div className="profile-avatar"></div>
      </div>
    </header>
  );
};