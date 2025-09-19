// Filename: src/components/Inventory.jsx

import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { Card } from './Card';
import '../styles/Inventory.css'; // New styles for the table

export const Inventory = () => {
  const { data: inventory, loading, error } = useFetch('/api/inventory');

  if (loading) return <p>Loading inventory...</p>;
  if (error) return <p>Error loading inventory: {error}</p>;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Inventory Management</h1>
        <p>Track your stock and supplies here.</p>
      </header>
      <Card>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {inventory?.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};