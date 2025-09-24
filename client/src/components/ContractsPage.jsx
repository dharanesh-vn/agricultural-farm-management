import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { Card } from './Card';
import { useAuth, useSocket } from '../context/AuthContext';
import '../styles/Dashboard.css';
import '../styles/Contracts.css';

export const ContractsPage = () => {
    const { user } = useAuth();
    const socket = useSocket();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionInProgress, setActionInProgress] = useState(null);

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setLoading(true);
                const { data } = await API.get('/contracts');
                setContracts(data);
            } catch (err) {
                setError('Failed to fetch contracts.');
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();

        const handleNewContract = (newContract) => {
            if (user?._id === newContract.farmer._id || user?._id === newContract.buyer._id) {
                setContracts(prev => [newContract, ...prev]);
            }
        };
        socket.on('newContract', handleNewContract);
        return () => socket.off('newContract', handleNewContract);
    }, [socket, user]);

    const handlePayment = async (contractId) => {
        setActionInProgress(contractId);
        try {
            const { data } = await API.post('/payments/create-checkout-session', { contractId });
            window.location.href = data.url;
        } catch (err) {
            alert(err.response?.data?.message || 'Error initiating payment.');
            setActionInProgress(null);
        }
    };

    const handleStatusUpdate = async (contractId, newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this as "${newStatus}"?`)) return;
        setActionInProgress(contractId);
        try {
            await API.put(`/contracts/${contractId}/status`, { status: newStatus });
            setContracts(prev => prev.map(c => c._id === contractId ? { ...c, status: newStatus } : c));
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
            <header className="dashboard-header"><h1>My Contracts</h1><p>Manage your trades.</p></header>
            <div className="contracts-list">
                {contracts.length > 0 ? (
                    contracts.map(contract => {
                        const isBuyer = user?._id === contract.buyer._id;
                        const isFarmer = user?._id === contract.farmer._id;
                        const isDisabled = actionInProgress === contract._id;
                        return (
                           <Card key={contract._id} className="contract-card">
                               <div className="contract-header"><h3>{contract.produce}</h3><span className={`status-chip status-${contract.status}`}>{contract.status.replace('_', ' ')}</span></div>
                               <div className="contract-body">
                                    <p><strong>Farmer:</strong> {contract.farmer.name}</p>
                                    <p><strong>Buyer:</strong> {contract.buyer.name}</p>
                                    <p><strong>Price:</strong> ₹{contract.price}</p>
                                    <p><strong>Payment:</strong> <span className={contract.paymentStatus}>{contract.paymentStatus}</span></p>
                               </div>
                               <div className="contract-actions">
                                    {isBuyer && contract.status === 'pending' && <button className="btn-primary" onClick={() => handlePayment(contract._id)} disabled={isDisabled}>{isDisabled ? 'Connecting...' : 'Pay with Stripe'}</button>}
                                    {isFarmer && contract.status === 'awaiting_shipment' && <button className="btn-primary" onClick={() => handleStatusUpdate(contract._id, 'shipped')} disabled={isDisabled}>{isDisabled ? 'Updating...' : 'Mark as Shipped'}</button>}
                                    {isBuyer && contract.status === 'shipped' && <button className="btn-primary" onClick={() => handleStatusUpdate(contract._id, 'completed')} disabled={isDisabled}>{isDisabled ? 'Confirming...' : 'Confirm Delivery'}</button>}
                                    {contract.status === 'completed' && <p className="completed-text">Transaction complete.</p>}
                               </div>
                           </Card>
                        );
                    })
                ) : ( <p>You have no contracts yet.</p> )}
            </div>
        </div>
    );
};