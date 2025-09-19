import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Alert } from '@mui/material';
import { format } from 'date-fns';
import API from '../api/api';

const ContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchContracts = async () => {
            try {
                const { data } = await API.get('/contracts');
                setContracts(data);
            } catch (err) {
                setError('Could not fetch your contracts.');
            } finally {
                setLoading(false);
            }
        };
        fetchContracts();
    }, []);

    const getStatusChip = (status) => {
        const colorMap = {
            pending: 'warning',
            awaiting_shipment: 'info',
            shipped: 'primary',
            completed: 'success',
            disputed: 'error',
            cancelled: 'default',
        };
        return <Chip label={status.replace('_', ' ').toUpperCase()} color={colorMap[status] || 'default'} />;
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>My Contracts</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produce</TableCell>
                            <TableCell>Farmer</TableCell>
                            <TableCell>Buyer</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Updated</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contracts.length > 0 ? (
                            contracts.map((contract) => (
                                <TableRow key={contract._id}>
                                    <TableCell>{contract.produce}</TableCell>
                                    <TableCell>{contract.farmer.name}</TableCell>
                                    <TableCell>{contract.buyer.name}</TableCell>
                                    <TableCell>₹{contract.price}</TableCell>
                                    <TableCell>{getStatusChip(contract.status)}</TableCell>
                                    <TableCell>{format(new Date(contract.updatedAt), 'PPpp')}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow><TableCell colSpan={6} align="center">You have no contracts.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ContractsPage;