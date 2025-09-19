// Filename: src/components/Dashboard.jsx

import React from 'react';
import { Card } from './Card';
import { useFetch } from '../hooks/useFetch'; // Import our custom hook
import '../styles/Dashboard.css';

export const Dashboard = () => {
  // Fetch data from the backend using the hook
  const { data, loading, error } = useFetch('/api/dashboard');

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Agricultural Farm Management panel.</p>
      </header>

      <div className="dashboard-grid">
        <Card title="Crop Status">
          {data?.cropStatus.map((crop, index) => (
            <p key={index}><strong>{crop.name}:</strong> {crop.status}</p>
          ))}
        </Card>

        <Card title="Recent Alerts">
          <ul>
            {data?.alerts.map((alert, index) => <li key={index}>{alert}</li>)}
          </ul>
        </Card>
        
        {/* These can be converted to fetch from the API later */}
        <Card title="Weather Forecast"><p>See Weather Page</p></Card>
        <Card title="Equipment Status"><p>See Inventory Page</p></Card>
      </div>
    </div>
  );
};