// Filename: src/components/Sidebar.jsx

import React from 'react'; // Import React
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaGavel, FaWarehouse, FaCloudSun } from 'react-icons/fa';
import '../styles/Sidebar.css';

// By wrapping the component in React.memo, we optimize it to only re-render
// when its props change. Since this sidebar has no props, it will render only once.
const SidebarComponent = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        Agri<span>Farm</span>
      </div>
      <ul className="sidebar-nav">
        <li className="nav-item">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaTachometerAlt className="nav-icon" /> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/live-auction" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaGavel className="nav-icon" /> Live Auction
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/inventory" className={({ isActive }) => (isActive ? 'active' : '')}>
             <FaWarehouse className="nav-icon" /> Inventory
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/weather" className={({ isActive }) => (isActive ? 'active' : '')}>
            <FaCloudSun className="nav-icon" /> Weather
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export const Sidebar = React.memo(SidebarComponent);