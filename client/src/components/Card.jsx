// Filename: src/components/Card.jsx

import React from 'react';
import '../styles/Dashboard.css'; // We'll reuse the dashboard card styles

export const Card = ({ title, children }) => {
  return (
    <div className="dashboard-card">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
};