import React, { useState, useContext } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, CircularProgress } from '@mui/material';
import AuthContext from '../context/AuthContext';
import API from '../api/api';

const ProfilePage = () => {
    const { user, login } = useContext(AuthContext); // Use login to refresh user state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
    });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
            };
            // Only include password in payload if it's being changed
            if (formData.password) {
                payload.password = formData.password;
            }

            await API.put('/users/profile', payload);
            setSuccess('Profile updated successfully! Re-logging to apply changes...');
            
            // To refresh the user context everywhere, we can re-login
            // This is a simple strategy for state synchronization.
            setTimeout(async () => {
                await login(payload.email, formData.password || user.password); // This assumes the old password is correct if new one isn't set
                setSuccess('Profile updated and session refreshed!');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>My Profile</Typography>
            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 500 }}>
                <Typography variant="h6">Update Your Information</Typography>
                <TextField fullWidth margin="normal" label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                <TextField fullWidth margin="normal" label="New Password (optional)" name="password" type="password" value={formData.password} onChange={handleChange} helperText="Leave blank to keep current password" />
                
                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
            </Paper>
        </Box>
    );
};

export default ProfilePage;