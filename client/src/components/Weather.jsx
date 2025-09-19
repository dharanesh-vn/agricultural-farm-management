// Filename: src/components/Weather.jsx

import React from 'react';
import { Card } from './Card';

export const Weather = () => {
  return (
    <div>
      <header className="dashboard-header">
        <h1>Weather Station</h1>
        <p>View real-time weather data and forecasts.</p>
      </header>
      <Card>
        <p>This feature is currently under development.</p>
      </Card>
    </div>
  );
};