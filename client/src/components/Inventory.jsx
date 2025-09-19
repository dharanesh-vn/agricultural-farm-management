// Filename: src/components/Inventory.jsx

import React from 'react';
import { Card } from './Card';

export const Inventory = () => {
  return (
    <div>
      <header className="dashboard-header">
        <h1>Inventory Management</h1>
        <p>Track your stock and supplies here.</p>
      </header>
      <Card>
        <p>This feature is currently under development.</p>
      </Card>
    </div>
  );
};