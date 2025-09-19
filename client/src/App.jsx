// Filename: src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LiveAuction } from './components/LiveAuction';

// Import the new components from their dedicated files
import { Inventory } from './components/Inventory';
import { Weather } from './components/Weather';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="live-auction" element={<LiveAuction />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="weather" element={<Weather />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;