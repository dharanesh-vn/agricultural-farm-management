import React, { useState, useContext } from 'react';
import { Button, TextField, Container, Typography, Box, Alert, Grid } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard'); // Redirect on success
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Farm Management System Login</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField margin="normal" required fullWidth label="Email Address" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Typography component={Link} to="/register" variant="body2">Don't have an account? Sign Up</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;