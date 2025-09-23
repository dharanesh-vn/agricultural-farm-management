import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Card } from './Card';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';
import '../styles/Contracts.css';

export const ContractsPage = () => {
    const { user } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionInProgress, setActionInProgress] = useState(null);

    const fetchContracts = async () => {
        try {
            // No need to set loading true on refresh, for a smoother UX
            const { data } = await API.get('/contracts');
            setContracts(data);
        } catch (err) {
            setError('Failed to fetch your contracts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts();
    }, []);

    // --- PAYMENT SIMULATION HANDLER ---
    const handlePayment = async (contractId) => {
        setActionInProgress(contractId);
        try {
            // Call the backend simulation endpoint
            await API.post('/payments/create-checkout-session', { contractId });
            
            // On success, show an alert and refresh the contracts list
            alert('Payment Successful! The farmer has been notified to ship your item.');
            fetchContracts(); // This will re-fetch and show the new "awaiting_shipment" status
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
            alert(`Payment Error: ${errorMessage}`);
        } finally {
            setActionInProgress(null);
        }
    };
    
    const handleStatusUpdate = async (contractId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this contract as "${newStatus}"?`)) return;
        setActionInProgress(contractId);
        try {
            await API.put(`/contracts/${contractId}/status`, { status: newStatus });
            fetchContracts();
        } catch (err) {
            alert('Failed to update status.');
        } finally {
            setActionInProgress(null);
        }
    };

    if (loading) return <p>Loading contracts...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <header className="dashboard-header">
                <h1>My Contracts</h1>
                <p>Manage the lifecycle of your trades from payment to delivery.</p>
            </header>
            <div className="contracts-list">
                {contracts.length > 0 ? (
                    contracts.map(contract => {
                        const isBuyer = user?._id === contract.buyer._id;
                        const isFarmer = user?._id === contract.farmer._id;
                        const isActionDisabled = actionInProgress === contract._id;

                        return (
                            <Card key={contract._id} className="contract-card">
                               <div className="contract-header">
                                 <h3>{contract.produce}</h3>
                                 <span className={`status-chip status-${contract.status}`}>{contract.status.replace('_', ' ')}</span>
                               </div>
                               <div className="contract-body">
                                    <p><strong>Farmer:</strong> {contract.farmer.name}</p>
                                    <p><strong>Buyer:</strong> {contract.buyer.name}</p>
                                    <p><strong>Final Price:</strong> ₹{contract.price}</p>
                                    <p><strong>Payment:</strong> <span className={contract.paymentStatus}>{contract.paymentStatus}</span></p>
                               </div>
                               <div className="contract-actions">
                                    {isBuyer && contract.status === 'pending' && (
                                        <button className="btn-primary" onClick={() => handlePayment(contract._id)} disabled={isActionDisabled}>
                                            {isActionDisabled ? 'Processing...' : 'Pay Now (Simulated)'}
                                        </button>
                                    )}
                                    {isFarmer && contract.status === 'awaiting_shipment' && (
                                        <button className="btn-primary" onClick={() => handleStatusUpdate(contract._id, 'shipped')} disabled={isActionDisabled}>
                                            {isActionDisabled ? 'Updating...' : 'Mark as Shipped'}
                                        </button>
                                    )}
                                    {isBuyer && contract.status === 'shipped' && (
                                        <button className="btn-primary" onClick={() => handleStatusUpdate(contract._id, 'completed')} disabled={isActionDisabled}>
                                            {isActionDisabled ? 'Confirming...' : 'Confirm Delivery'}
                                        </button>
                                    )}
                                    {contract.status === 'completed' && (<p className="completed-text">This transaction is complete.</p>)}
                               </div>
                            </Card>
                        )
                    })
                ) : ( <p>You have no contracts yet.</p> )}
            </div>
        </div>
    );
};