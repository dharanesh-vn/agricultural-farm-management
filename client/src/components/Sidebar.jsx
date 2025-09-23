import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaGavel, FaWarehouse, FaCloudSun, FaSignOutAlt, FaFileSignature } from 'react-icons/fa';
import '../styles/Sidebar.css';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar-redesigned">
      <div className="sidebar-header">
        <div className="logo">Agri<span>Farm</span></div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/app/dashboard"><FaTachometerAlt /><span>Dashboard</span></NavLink>
        <NavLink to="/app/live-auction"><FaGavel /><span>Live Auction</span></NavLink>
        <NavLink to="/app/contracts"><FaFileSignature /><span>My Contracts</span></NavLink>
        {user?.role === 'farmer' && (
          <>
            <NavLink to="/app/inventory"><FaWarehouse /><span>Inventory</span></NavLink>
            <NavLink to="/app/weather"><FaCloudSun /><span>Weather</span></NavLink>
          </>
        )}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
            </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
            <FaSignOutAlt />
            <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};