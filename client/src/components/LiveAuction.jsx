// Filename: src/components/LiveAuction.jsx

import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { Card } from './Card';
import '../styles/Dashboard.css'; // Reuse styles
import '../styles/LiveAuction.css'; // Add new styles

export const LiveAuction = () => {
  const { data: auctions, loading, error, setData: setAuctions } = useFetch('/api/auctions');

  const handleBid = async (auctionId) => {
    const newBid = prompt('Enter your new bid amount:');
    if (!newBid || isNaN(newBid)) {
      alert('Please enter a valid number.');
      return;
    }

    try {
      const response = await fetch(`/api/auctions/${auctionId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidAmount: parseFloat(newBid), bidderName: 'You' }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      const updatedAuction = await response.json();
      
      // Update the local state to show the new bid immediately
      setAuctions(currentAuctions => 
        currentAuctions.map(a => a.id === auctionId ? updatedAuction : a)
      );
      
      alert('Bid placed successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p>Loading auctions...</p>;
  if (error) return <p>Error loading auctions: {error}</p>;

  return (
    <div>
      <header className="dashboard-header">
        <h1>Live Auction</h1>
        <p>View and participate in ongoing produce auctions.</p>
      </header>
      <div className="auction-grid">
        {auctions?.map(auction => (
          <Card key={auction.id}>
            {/* In a real app, you'd have images in your public folder */}
            {/* <img src={auction.image} alt={auction.item} className="auction-image" /> */}
            <div className="auction-details">
              <h3>{auction.item}</h3>
              <p>Current Bid: <strong>${auction.currentBid}</strong> (by {auction.bidder})</p>
              <p>Time Left: {auction.timeLeft}</p>
              <button className="bid-button" onClick={() => handleBid(auction.id)}>Place Bid</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};