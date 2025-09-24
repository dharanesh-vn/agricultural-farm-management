import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { useAuth, useSocket } from '../context/AuthContext';
import API from '../api/api';
import '../styles/Dashboard.css';
import '../styles/LiveAuction.css';
import '../styles/Modal.css';

const Timer = ({ endTime, status }) => {
    const [timeLeft, setTimeLeft] = useState(Math.round((new Date(endTime) - new Date()) / 1000));
    useEffect(() => {
        if (timeLeft <= 0 || status === 'ended') return;
        const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, status]);
    if (status === 'ended' || timeLeft <= 0) return <span className="timer-ended">Auction Ended</span>;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return <span className="timer-active">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
};

const StartAuctionModal = ({ onClose, onStartAuction }) => {
    const [data, setData] = useState({ itemName: '', quantity: '', startingBid: '', minIncrement: '10', duration: '5' });
    const handleChange = e => setData({...data, [e.target.name]: e.target.value});
    const handleSubmit = () => {
        if (!data.itemName.trim() || !data.quantity.trim() || !data.startingBid || !data.minIncrement || !data.duration) {
            return alert('Please fill all fields.');
        }
        if (window.confirm(`Start auction for ${data.quantity} of ${data.itemName} at ₹${data.startingBid}?`)) {
            onStartAuction({ ...data, startingBid: Number(data.startingBid), minIncrement: Number(data.minIncrement), duration: Number(data.duration) });
        }
    };
    return (
        <div className="modal-backdrop"><div className="modal-content">
            <h2>Start New Auction</h2>
            <input name="itemName" placeholder="Produce Name" onChange={handleChange} />
            <input name="quantity" placeholder="Quantity (e.g., 50 kg)" onChange={handleChange} />
            <input name="startingBid" type="number" placeholder="Starting Bid (₹)" onChange={handleChange} />
            <input name="minIncrement" type="number" value={data.minIncrement} placeholder="Min. Bid Increment (₹)" onChange={handleChange} />
            <label>Duration (minutes)</label>
            <input name="duration" type="number" value={data.duration} onChange={handleChange} />
            <div className="modal-actions">
                <button onClick={onClose} className="btn-secondary">Cancel</button>
                <button onClick={handleSubmit} className="btn-primary">Confirm & Start</button>
            </div>
        </div></div>
    );
};

export const LiveAuction = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/marketplace');
      setAuctions(data);
      setError('');
    } catch (err) {
      setError('Could not fetch auctions. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuctions();
    const handleAuctionStarted = (newAuction) => setAuctions(prev => [newAuction, ...prev]);
    const handleNewBid = (updatedAuction) => setAuctions(prev => prev.map(a => a._id === updatedAuction._id ? updatedAuction : a));
    const handleAuctionEnded = (endedAuction) => {
        alert(`Auction for ${endedAuction.itemName} has ended!`);
        setAuctions(prev => prev.map(a => a._id === endedAuction._id ? { ...a, status: 'ended' } : a));
    };
    const handleAuctionError = (error) => alert(`Auction Error: ${error.message}`);
    socket.on('auctionStarted', handleAuctionStarted);
    socket.on('newBidUpdate', handleNewBid);
    socket.on('auctionEnded', handleAuctionEnded);
    socket.on('auctionError', handleAuctionError);
    return () => {
      socket.off('auctionStarted'); socket.off('newBidUpdate');
      socket.off('auctionEnded'); socket.off('auctionError');
    };
  }, [fetchAuctions, socket]);
  
  useEffect(() => {
    auctions.forEach(auction => socket.emit('joinAuction', auction._id));
    return () => auctions.forEach(auction => socket.emit('leaveAuction', auction._id));
  }, [auctions, socket]);

  const handleStartAuction = (auctionData) => {
    socket.emit('startAuction', { ...auctionData, sellerId: user._id, sellerName: user.name });
    setIsModalOpen(false);
  };

  const handleBid = (auction) => {
    const minNextBid = auction.currentBid + auction.minIncrement;
    const bidAmount = prompt(`Current bid is ₹${auction.currentBid}. Min next bid is ₹${minNextBid}.\nEnter your bid:`);
    if (bidAmount && !isNaN(bidAmount) && parseFloat(bidAmount) >= minNextBid) {
      socket.emit('placeBid', { auctionId: auction._id, bidAmount: parseFloat(bidAmount), bidderId: user._id, bidderName: user.name });
    } else {
      alert(`Invalid bid. Please enter a number that is at least ₹${minNextBid}.`);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  if (loading) return <p style={{ padding: '2rem' }}>Loading auctions...</p>;

  return (
    <div>
      <header className="dashboard-header"><h1>Live Auctions</h1>{user?.role === 'farmer' && <button className="start-auction-btn" onClick={() => setIsModalOpen(true)}>+ Start New Auction</button>}</header>
      {error && <p className="error-message">{error}</p>}
      <div className="auction-grid-redesigned">
        {auctions.length > 0 ? (
          auctions.map(auction => {
            const isAuctionActive = auction.status === 'active' && new Date(auction.endTime) > new Date();
            return (
              <Card key={auction._id} className={`auction-card ${isAuctionActive ? 'active' : 'ended'}`}>
                <div className="auction-card-header"><h3>{auction.itemName}</h3><span className="auction-quantity">{auction.quantity}</span></div>
                <div className="auction-card-body">
                  <div className="info-row"><span>Seller</span><span>{auction.sellerName}</span></div>
                  <div className="info-row"><span>Highest Bidder</span><span>{auction.highestBidderName || 'No bids yet'}</span></div>
                  <div className="current-bid-row"><span>Current Bid</span><span className="current-bid-price">₹{auction.currentBid}</span></div>
                  <div className="timer-row"><span>Time Left</span><Timer endTime={auction.endTime} status={auction.status} /></div>
                  <div className="date-info-row"><span>Started: {formatDate(auction.startTime)}</span><span>Ends: {formatDate(auction.endTime)}</span></div>
                </div>
                <div className="auction-card-footer">
                  {user?.role === 'buyer' && user._id !== auction.seller && isAuctionActive && <button className="bid-button-redesigned" onClick={() => handleBid(auction)}>Place Bid</button>}
                  {!isAuctionActive && <p className="ended-message">This auction has ended.</p>}
                </div>
              </Card>
            );
          })
        ) : ( !loading && <p>There are no active auctions right now.</p> )}
      </div>
      {isModalOpen && <StartAuctionModal onClose={() => setIsModalOpen(false)} onStartAuction={handleStartAuction} />}
    </div>
  );
};