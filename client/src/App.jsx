import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LiveAuction } from './components/LiveAuction';
import { Inventory } from './components/Inventory';
import { Weather } from './components/Weather';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { ContractsPage } from './components/ContractsPage'; // <-- Verified Import
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading session...</div>;
  }
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Application Wrapper */}
          <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} /> 
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="live-auction" element={<LiveAuction />} />
            <Route path="contracts" element={<ContractsPage />} /> {/* <-- Verified Route */}
            {/* Farmer-only routes */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="weather" element={<Weather />} />
          </Route>
          
          {/* Fallback for any other path */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;