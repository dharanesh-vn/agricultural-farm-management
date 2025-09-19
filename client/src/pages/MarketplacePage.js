import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import AuthContext from '../context/AuthContext';
import StartAuctionModal from '../components/auction/StartAuctionModal';
import io from 'socket.io-client';

const socket = io('http://localhost:5001'); // Your server URL

const MarketplacePage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch initial listings
        const fetchListings = async () => {
            try {
                const { data } = await API.get('/marketplace');
                setListings(data);
            } catch (err) {
                setError('Could not fetch listings.');
            } finally { setLoading(false); }
        };
        fetchListings();

        // Listen for new auctions in real-time
        socket.on('auctionStarted', (newAuction) => {
            // In a real app, you'd probably want to navigate or show a notification
            console.log('A new auction just started!', newAuction);
            navigate(`/auction/${newAuction._id}`);
        });

        return () => socket.off('auctionStarted');
    }, [navigate]);
    
    const handleStartAuction = (auctionData) => {
        socket.emit('startAuction', { ...auctionData, sellerId: user._id, sellerName: user.name });
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Marketplace</Typography>
                {user?.role === 'farmer' && (
                    <Button variant="contained" onClick={() => setIsModalOpen(true)}>Start New Auction</Button>
                )}
            </Box>
            <Grid container spacing={3}>
                {listings.length > 0 ? (
                    listings.map((listing) => (
                        <Grid item key={listing._id} xs={12} sm={6} md={4}><Card>
                            <CardContent>
                                <Typography variant="h5">{listing.title}</Typography>
                                <Typography color="text.secondary">Seller: {listing.seller.name}</Typography>
                                <Typography variant="h6" sx={{ mt: 2 }}>₹{listing.price}</Typography>
                            </CardContent>
                        </Card></Grid>
                    ))
                ) : (
                    <Typography sx={{ ml: 2 }}>No active listings. Be the first to start an auction!</Typography>
                )}
            </Grid>
            <StartAuctionModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onStartAuction={handleStartAuction} />
        </Box>
    );
};

export default MarketplacePage;