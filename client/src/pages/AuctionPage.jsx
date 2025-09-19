import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Grid, Paper, TextField, Button, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import AuthContext from '../context/AuthContext';
import { setAuction, updateBid } from '../features/auction/auctionSlice';
import io from 'socket.io-client';

const socket = io('http://localhost:5001');

const AuctionPage = () => {
    const { id: auctionId } = useParams();
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch();
    const { auction, bids, isLoading } = useSelector((state) => state.auction);
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        // Join the auction room and get initial data
        socket.emit('joinAuction', auctionId);
        socket.on('auctionData', (data) => {
            dispatch(setAuction(data));
        });
        
        // Listen for updates
        socket.on('newBidUpdate', (data) => {
            dispatch(updateBid(data));
        });

        return () => {
            socket.emit('leaveAuction', auctionId);
            socket.off('auctionData');
            socket.off('newBidUpdate');
        };
    }, [auctionId, dispatch]);

    const handlePlaceBid = () => {
        const bidData = {
            auctionId,
            bidAmount: Number(bidAmount),
            bidderId: user._id,
            bidderName: user.name,
        };
        socket.emit('placeBid', bidData);
        setBidAmount('');
    };

    if (isLoading || !auction) return <CircularProgress />;

    return (
        <Grid container spacing={3}>
            {/* Auction Info Panel */}
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h4">{auction.itemName}</Typography>
                    <Typography variant="h6" color="text.secondary">Sold by: {auction.sellerName}</Typography>
                    <Typography variant="h5" sx={{ my: 2 }}>Current Bid: <Typography component="span" variant="h4" color="primary">₹{auction.currentBid}</Typography></Typography>
                    <Typography>Highest Bidder: {auction.highestBidderName || 'None'}</Typography>
                    <Typography>Time Remaining: [Timer component]</Typography>
                </Paper>
                {/* Bid Input */}
                {user?.role === 'buyer' && (
                    <Paper sx={{ p: 2, mt: 2 }}>
                        <Typography variant="h6">Place Your Bid</Typography>
                        <Box sx={{ display: 'flex', mt: 1 }}>
                            <TextField type="number" label={`Min bid: ₹${auction.currentBid + auction.minIncrement}`} value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} size="small" />
                            <Button variant="contained" onClick={handlePlaceBid} sx={{ ml: 1 }}>Place Bid</Button>
                        </Box>
                    </Paper>
                )}
            </Grid>
            {/* Bid History / Chat Window */}
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6">Bid History</Typography>
                    <List dense>
                        {bids.map((bid, index) => (
                            <ListItem key={index}><ListItemText primary={`₹${bid.amount}`} secondary={bid.bidderName} /></ListItem>
                        ))}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};
export default AuctionPage;