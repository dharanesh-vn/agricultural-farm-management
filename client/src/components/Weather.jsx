import React, { useState, useEffect } from 'react';
import { Card } from './Card';
// --- FIX: Removed unused 'API' import ---
import '../styles/Dashboard.css';

export const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mockWeather = {
          current: { temp: 28, condition: 'Sunny', humidity: '65%', wind: '10 km/h' },
          forecast: [
            { day: 'Tomorrow', temp: 26, condition: 'Light Rain' },
            { day: 'Friday', temp: 29, condition: 'Partly Cloudy' },
          ]
      };
      setWeather(mockWeather);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <p>Loading weather data...</p>;

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