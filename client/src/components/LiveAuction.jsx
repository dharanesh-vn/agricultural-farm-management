import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { useAuth } from '../context/AuthContext';
import API from '../api/api';
import io from 'socket.io-client';
import '../styles/Dashboard.css';
import '../styles/LiveAuction.css';
import '../styles/Modal.css';

const socket = io('http://localhost:5001');

const Timer = ({ endTime, status }) => {
    const [timeLeft, setTimeLeft] = useState(Math.round((new Date(endTime) - new Date()) / 1000));
    useEffect(() => {
        if (timeLeft <= 0 || status === 'ended') return;
        const intervalId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft, status]);

    if (status === 'ended' || timeLeft <= 0) {
        return <span className="timer-ended">Auction Ended</span>;
    }
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return <span className="timer-active">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>;
};

export const LiveAuction = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const { data } = await API.get('/marketplace');
        setAuctions(data);
      } catch (err) {
        setError('Could not fetch auctions.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();

    socket.on('auctionStarted', (newAuction) => setAuctions(prev => [newAuction, ...prev]));
    socket.on('newBidUpdate', (updatedAuction) => setAuctions(prev => prev.map(a => a._id === updatedAuction._id ? updatedAuction : a)));
    socket.on('auctionEnded', (endedAuction) => {
      alert(`Auction for ${endedAuction.itemName} has ended!`);
      setAuctions(prev => prev.map(a => a._id === endedAuction._id ? { ...a, status: 'ended' } : a));
    });
    socket.on('auctionError', (error) => alert(`Error: ${error.message}`));

    return () => {
      socket.off('auctionStarted');
      socket.off('newBidUpdate');
      socket.off('auctionEnded');
      socket.off('auctionError');
    };
  }, []);
  
  useEffect(() => {
    auctions.forEach(auction => socket.emit('joinAuction', auction._id));
    return () => auctions.forEach(auction => socket.emit('leaveAuction', auction._id));
  }, [auctions]);

  const handleStartAuction = (auctionData) => {
    socket.emit('startAuction', { ...auctionData, sellerId: user._id, sellerName: user.name });
    setIsModalOpen(false);
  };

  const handleBid = (auction, currentBid, minIncrement) => {
    const minNextBid = currentBid + minIncrement;
    const bidAmount = prompt(`Current bid is ₹${currentBid}. Minimum next bid is ₹${minNextBid}.\nEnter your bid:`);
    if (bidAmount && !isNaN(bidAmount) && parseFloat(bidAmount) >= minNextBid) {
      socket.emit('placeBid', { auctionId: auction._id, bidAmount: parseFloat(bidAmount), bidderId: user._id, bidderName: user.name });
    } else {
      alert(`Invalid bid. Please enter a number that is at least ₹${minNextBid}.`);
    }
  };

  if (loading) return <p>Loading live auctions...</p>;
  if (error) return <p className="error-message">{error}</p>;

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div>
      <header className="dashboard-header">
        <h1>Live Auctions</h1>
        {user?.role === 'farmer' && (
          <button className="start-auction-btn" onClick={() => setIsModalOpen(true)}>+ Start New Auction</button>
        )}
      </header>
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
                  <div className="date-info-row">
                    <span>Started: {formatDate(auction.startTime)}</span>
                    <span>Ends: {formatDate(auction.endTime)}</span>
                  </div>
                </div>
                <div className="auction-card-footer">
                  {user?.role === 'buyer' && user._id !== auction.seller && isAuctionActive && (
                    <button className="bid-button-redesigned" onClick={() => handleBid(auction, auction.currentBid, auction.minIncrement)}>Place Bid</button>
                  )}
                  {auction.status === 'ended' && (<p className="ended-message">This auction has ended.</p>)}
                </div>
              </Card>
            )
          })
        ) : ( <p>There are no active auctions right now.</p> )}
      </div>
      {isModalOpen && <StartAuctionModal onClose={() => setIsModalOpen(false)} onStartAuction={handleStartAuction} />}
    </div>
  );
};

const StartAuctionModal = ({ onClose, onStartAuction }) => {
    const [data, setData] = useState({ itemName: '', quantity: '', startingBid: '', minIncrement: '10', duration: '5' });
    const handleChange = e => setData({...data, [e.target.name]: e.target.value});
    const handleSubmit = () => {
        const { itemName, quantity, startingBid, minIncrement, duration } = data;
        if (!itemName.trim() || !quantity.trim() || !startingBid || !minIncrement || !duration) {
            return alert('Please fill all fields.');
        }
        if (window.confirm(`Start auction for ${quantity} of ${itemName} at ₹${startingBid}?`)) {
            onStartAuction({ ...data, startingBid: Number(startingBid), minIncrement: Number(minIncrement), duration: Number(duration) });
        }
    };
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
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
            </div>
        </div>
    );
};