import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import '../styles/App.css'; // Will be updated

export const Layout = () => {
  return (
    <div className="app-layout-redesigned">
      <Sidebar />
      <div className="main-content-wrapper">
        <Header />
        <main className="content-area">
          <Outlet /> {/* Child routes will render and scroll here */}
        </main>
      </div>
    </div>
  );
};