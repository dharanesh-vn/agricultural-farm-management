import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar'; // This import will now work correctly
import { Header } from './Header';
import '../styles/App.css';

export const Layout = () => {
  return (
    <div className="app-layout-redesigned">
      <Sidebar />
      <div className="main-content-wrapper">
        <Header />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};