import React, { useState, useEffect } from 'react';
import { Card } from './Card';
// --- FIX: Removed unused 'API' import ---
import '../styles/Inventory.css';

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockInventory = [
        { id: 101, name: 'Urea Fertilizer', quantity: 50, unit: 'bags' },
        { id: 102, name: 'Pesticide Type B', quantity: 25, unit: 'liters' },
        { id: 103, name: 'Corn Seeds', quantity: 150, unit: 'kg' },
      ];
      setInventory(mockInventory);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p>Loading inventory...</p>;

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