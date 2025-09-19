// Filename: src/components/Layout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header'; // Import the new Header
import '../styles/App.css';

export const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-area">
        <Header /> {/* Add the Header here */}
        <main>
          <Outlet /> {/* Child routes will render here */}
        </main>
      </div>
    </div>
  );
};