// Filename: src/components/Weather.jsx

import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { Card } from './Card';
import '../styles/Dashboard.css';

export const Weather = () => {
  const { data: weather, loading, error } = useFetch('/api/weather');

  if (loading) return <p>Loading weather data...</p>;
  if (error) return <p>Error loading weather data: {error}</p>;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Weather Station</h1>
        <p>Real-time weather data and forecasts for your farm.</p>
      </header>
      <div className="dashboard-grid">
        <Card title="Current Conditions">
          <p><strong>Temperature:</strong> {weather?.current.temp}°C</p>
          <p><strong>Condition:</strong> {weather?.current.condition}</p>
          <p><strong>Humidity:</strong> {weather?.current.humidity}</p>
          <p><strong>Wind:</strong> {weather?.current.wind}</p>
        </Card>
        <Card title="Forecast">
          {weather?.forecast.map(day => (
            <p key={day.day}><strong>{day.day}:</strong> {day.temp}°C, {day.condition}</p>
          ))}
        </Card>
      </div>
    </div>
  );
};