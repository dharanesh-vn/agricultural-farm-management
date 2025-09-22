import React, { useState } from 'react'; // --- FIX: Removed unused 'useEffect' ---
import '../styles/Modal.css';

const StartAuctionModal = ({ onClose, onStartAuction }) => {
    const [data, setData] = useState({ itemName: '', quantity: '', startingBid: '', duration: '5' });

    const handleChange = e => setData({...data, [e.target.name]: e.target.value});

    const handleSubmit = () => {
        const startBid = Number(data.startingBid);
        const duration = Number(data.duration);
        if (!data.itemName.trim() || !data.quantity.trim() || isNaN(startBid) || startBid <= 0 || isNaN(duration) || duration <= 0) {
            alert('Please fill all fields with valid values.');
            return;
        }
        const confirmationMessage = `Are you sure you want to start this auction?\n\nProduce: ${data.itemName}\nQuantity: ${data.quantity}\nStarting Bid: ₹${startBid}\nDuration: ${duration} minutes`;
        if (window.confirm(confirmationMessage)) {
            onStartAuction({
                ...data,
                startingBid: startBid,
                duration: duration
            });
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Start New Auction</h2>
                <input name="itemName" placeholder="Produce Name (e.g., Organic Wheat)" onChange={handleChange} />
                <input name="quantity" placeholder="Quantity (e.g., 50 kg)" onChange={handleChange} />
                <input name="startingBid" type="number" placeholder="Starting Bid (₹)" onChange={handleChange} />
                <label>Duration (minutes)</label>
                <input name="duration" type="number" value={data.duration} onChange={handleChange} />
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-secondary">Cancel</button>
                    <button onClick={handleSubmit} className="btn-primary">Confirm & Start Auction</button>
                </div>
            </div>
        </div>
    );
};

export default StartAuctionModal;