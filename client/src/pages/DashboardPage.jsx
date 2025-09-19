import React, { useState, useEffect, useContext } from 'react';
// --- FIX: Removed unused 'ListItem', 'ListItemText', 'Divider', 'Button' ---
import { Typography, Box, Paper, Grid, List, CircularProgress, Alert } from '@mui/material';
// --- FIX: Removed unused 'Link' ---
import AuthContext from '../context/AuthContext';
import API from '../api/api';

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await API.get('/dashboard');
                setDashboardData(data);
            } catch (err) {
                setError('Could not fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchData();
    }, [user]);

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    // We are not using these specific widgets yet, so the components are not needed.
    const { actionItems, displayWidgets } = dashboardData || {};

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome back, {user?.name}!</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Action Required</Typography>
                        {actionItems && actionItems.length > 0 ? (
                            // Placeholder for action items
                            <List>
                               <Typography variant="body2">Action items will be displayed here.</Typography>
                            </List>
                        ) : (
                            <Typography>No pending actions. You're all caught up!</Typography>
                        )}
                    </Paper>
                </Grid>
                {user?.role === 'farmer' && (
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>Recent Sales</Typography>
                             {displayWidgets?.recentSales && displayWidgets.recentSales.length > 0 ? (
                                <Typography variant="body2">Recent sales data will be displayed here.</Typography>
                             ) : (<Typography>No recent sales.</Typography>)}
                        </Paper>
                    </Grid>
                )}
                 {user?.role === 'buyer' && (
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>Recent Purchases</Typography>
                            {displayWidgets?.winningBids && displayWidgets.winningBids.length > 0 ? (
                                <Typography variant="body2">Recent purchase data will be displayed here.</Typography>
                            ) : (<Typography>No recent purchases.</Typography>)}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DashboardPage;