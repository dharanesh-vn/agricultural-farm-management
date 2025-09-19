import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryModal from '../components/inventory/InventoryModal';
import API from '../api/api';

const InventoryPage = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/inventory');
            setInventory(data.map(item => ({ ...item, id: item._id })));
        } catch (err) { setError('Failed to fetch inventory.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchInventory(); }, []);

    const handleOpenModal = (item = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setCurrentItem(null);
        setIsModalOpen(false);
    };
    const handleSave = () => {
        fetchInventory();
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await API.delete(`/inventory/${id}`);
                fetchInventory();
            } catch (err) { setError('Failed to delete item.'); }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Inventory Management</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>Add New Item</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {loading ? <CircularProgress /> : <InventoryTable inventory={inventory} onEdit={handleOpenModal} onDelete={handleDelete} />}
            <InventoryModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSave} item={currentItem} />
        </Box>
    );
};

export default InventoryPage;