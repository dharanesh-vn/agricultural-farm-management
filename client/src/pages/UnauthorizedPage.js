import React from 'react';
import { Typography, Box, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => (
    <Container>
        <Box sx={{ textAlign: 'center', mt: 10 }}>
            <Typography variant="h3" gutterBottom>Access Denied</Typography>
            <Typography variant="body1">You do not have permission to view this page.</Typography>
            <Button component={Link} to="/dashboard" variant="contained" sx={{ mt: 4 }}>
                Go to Dashboard
            </Button>
        </Box>
    </Container>
);

export default UnauthorizedPage;