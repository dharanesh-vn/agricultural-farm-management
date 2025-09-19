import React, { useState, useContext } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'farmer' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        try {
            await register(formData.name, formData.email, formData.password, formData.role);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Create an Account</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField margin="normal" required fullWidth label="Full Name" name="name" onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Email Address" name="email" type="email" onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Password" name="password" type="password" onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Confirm Password" name="confirmPassword" type="password" onChange={handleChange} />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Sign up as a...</InputLabel>
                        <Select name="role" value={formData.role} label="Sign up as a..." onChange={handleChange}>
                            <MenuItem value="farmer">Farmer</MenuItem>
                            <MenuItem value="buyer">Buyer</MenuItem>
                        </Select>
                    </FormControl>
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography component={Link} to="/login" variant="body2">Already have an account? Sign In</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;