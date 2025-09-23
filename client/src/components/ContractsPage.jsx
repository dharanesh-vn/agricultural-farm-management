import React, { useState, useEffect, useRef } from 'react';
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
    const [actionInProgress, setActionInProgress] = useState(null); // Tracks which contract is being acted upon
    const paymentSuccessChecked = useRef(false);

    // --- Function to fetch the latest contract data from the server ---
    const fetchContracts = async () => {
        try {
            // No need to set loading to true here, as we can refresh in the background
            const { data } = await API.get('/contracts');
            setContracts(data);
        } catch (err) {
            setError('Failed to fetch your contracts. Please try refreshing the page.');
            console.error(err);
        } finally {
            setLoading(false); // Stop loading indicator once data is fetched
        }
    };

    // --- Effect to run on initial component load ---
    useEffect(() => {
        // Check for a successful payment redirect from Stripe only once
        if (!paymentSuccessChecked.current) {
            const query = new URLSearchParams(window.location.search);
            if (query.get("payment_success")) {
                alert("Payment was successful! Your contract is being updated.");
                // Clean the URL to prevent the alert on subsequent refreshes
                window.history.replaceState(null, null, window.location.pathname);
            }
            paymentSuccessChecked.current = true;
        }
        fetchContracts();
    }, []);

    // --- Function to handle redirecting the buyer to Stripe for payment ---
    const handlePayment = async (contractId) => {
        setActionInProgress(contractId);
        try {
            const { data } = await API.post('/payments/create-checkout-session', { contractId });
            window.location.href = data.url; // Redirect to Stripe's secure checkout
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An unknown error occurred.';
            alert(`Payment Error: ${errorMessage}`);
            setActionInProgress(null);
        }
    };

    // --- Function for BOTH Farmer and Buyer to update the contract status ---
    const handleStatusUpdate = async (contractId, newStatus) => {
        const confirmMessage = `Are you sure you want to mark this contract as "${newStatus.replace('_', ' ')}"?`;
        if (!window.confirm(confirmMessage)) return;

        setActionInProgress(contractId);
        try {
            // Call the backend API to update the status
            await API.put(`/contracts/${contractId}/status`, { status: newStatus });
            // Refresh the contract list to show the new status immediately
            fetchContracts();
        } catch (err) {
            alert('Failed to update status. You may not have permission for this action.');
        } finally {
            setActionInProgress(null);
        }
    };

    if (loading) return <p>Loading your contracts...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <header className="dashboard-header">
                <h1>My Contracts</h1>
                <p>Manage the lifecycle of your trades from payment to delivery.</p>
            </header>
            
            <div className="contracts-list">
                {!loading && contracts.length === 0 ? (
                    <Card><p>You have no contracts yet. Win or sell an item in an auction to create one!</p></Card>
                ) : (
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
                                    {/* --- Buyer's Action Buttons --- */}
                                    {isBuyer && contract.status === 'pending' && (
                                        <button className="btn-primary" onClick={() => handlePayment(contract._id)} disabled={isActionDisabled}>
                                            {isActionDisabled ? 'Connecting to Stripe...' : 'Pay Now with Stripe'}
                                        </button>
                                    )}
                                    {isBuyer && contract.status === 'shipped' && (
                                        <button className="btn-primary" onClick={() => handleStatusUpdate(contract._id, 'completed')} disabled={isActionDisabled}>
                                            {isActionDisabled ? 'Confirming...' : 'Confirm Delivery'}
                                        </button>
                                    )}

                                    {/* --- Farmer's Action Button --- */}
                                    {isFarmer && contract.status === 'awaiting_shipment' && (
                                        <button className="btn-primary" onClick={() => handleStatusUpdate(contract._id, 'shipped')} disabled={isActionDisabled}>
                                            {isActionDisabled ? 'Updating...' : 'Mark as Shipped'}
                                        </button>
                                    )}

                                    {/* --- Status Messages for Other States --- */}
                                    {isFarmer && contract.status === 'pending' && (<p className="completed-text">Awaiting payment from buyer.</p>)}
                                    {isFarmer && contract.status === 'shipped' && (<p className="completed-text">Awaiting delivery confirmation from buyer.</p>)}
                                    {contract.status === 'completed' && (<p className="completed-text">This transaction is complete.</p>)}
                               </div>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    );
};