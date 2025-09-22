import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // We'll create this new stylesheet

export const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="logo">
          Agri<span>Farm</span>
        </div>
        <nav>
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Register</Link>
        </nav>
      </header>
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            The Digital Marketplace for Modern Agriculture.
          </h1>
          <p className="hero-subtitle">
            Connect directly with buyers, sell your produce in live auctions, and manage your farm with data-driven insights. Your harvest has a new home.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-primary btn-large">Get Started Today</Link>
          </div>
        </div>
      </main>
    </div>
  );
};