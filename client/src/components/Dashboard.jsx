import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import API from '../api/api';
import '../styles/Dashboard.css';

export const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/dashboard');
        // The backend `dashboardController` provides `actionItems`
        setData({
          alerts: response.data.actionItems.map(item => item.text)
        });
      } catch (err) {
        setError('Could not fetch dashboard data. Please log in.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your Agricultural Farm Management panel.</p>
      </header>
      <div className="dashboard-grid">
        <Card title="Action Required">
          {data?.alerts && data.alerts.length > 0 ? (
            <ul>
              {data.alerts.map((alert, index) => <li key={index}>{alert}</li>)}
            </ul>
          ) : (
            <p>No pending actions. You're all caught up!</p>
          )}
        </Card>
        <Card title="Recent Sales / Wins">
          <p>Completed transactions will appear here.</p>
        </Card>
        <Card title="Weather Forecast"><p>See Weather Page</p></Card>
        <Card title="My Inventory"><p>See Inventory Page</p></Card>
      </div>
    </div>
  );
};