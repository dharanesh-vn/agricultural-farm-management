// Filename: src/components/LiveAuction.jsx

import React from 'react';
import '../styles/Dashboard.css'; // We can reuse some styles

export const LiveAuction = () => {
  return (
    <div>
      <header className="dashboard-header">
        <h1>Live Auction</h1>
        <p>View and participate in ongoing produce auctions.</p>
      </header>
      <div className="dashboard-card">
        <h2>Upcoming Auctions</h2>
        <p>This feature is currently under development.</p>
        <p>Check back soon to see live auctions for wheat, corn, and other produce!</p>
      </div>
    </div>
  );
};