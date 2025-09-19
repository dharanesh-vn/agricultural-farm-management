// Filename: src/components/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { Card } from './Card'; // Import our new reusable Card component
import '../styles/Dashboard.css';

// A mock function to simulate fetching data from a server
const fetchDashboardData = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        cropStatus: [
          { name: 'Wheat', status: 'Growing (75% maturity)' },
          { name: 'Corn', status: 'Harvesting Soon (Scheduled for next week)' },
          { name: 'Soybeans', status: 'Planting Phase' },
        ],
        alerts: [
          'Low moisture detected in Sector A.',
          'Tractor #3 maintenance is due.',
          'Pest activity reported near Sector C.',
        ],
      });
    }, 1000); // Simulate a 1-second network delay
  });
};

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData().then(fetchedData => {
      setData(fetchedData);
      setLoading(false);
    });
  }, []); // The empty array ensures this runs only once when the component mounts

  if (loading) {
    return <p>Loading dashboard data...</p>;
  }

  return (
    <div>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Agricultural Farm Management panel.</p>
      </header>

      <div className="dashboard-grid">
        <Card title="Crop Status">
          {data.cropStatus.map((crop, index) => (
            <p key={index}>
              <strong>{crop.name}:</strong> {crop.status}
            </p>
          ))}
        </Card>

        <Card title="Recent Alerts">
          <ul>
            {data.alerts.map((alert, index) => (
              <li key={index}>{alert}</li>
            ))}
          </ul>
        </Card>

        <Card title="Weather Forecast">
          <p><strong>Today:</strong> Sunny, 28°C</p>
          <p><strong>Tomorrow:</strong> Light rain expected</p>
        </Card>

        <Card title="Equipment Status">
          <p><strong>Tractor #1:</strong> Active</p>
          <p><strong>Irrigation System:</strong> Idle</p>
        </Card>
      </div>
    </div>
  );
};