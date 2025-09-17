// src/pages/DashboardPage.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const DashboardPage = () => {
    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                Welcome to the Dashboard!
            </Typography>
            <Typography>
                You have successfully logged in.
            </Typography>
        </Container>
    );
};

export default DashboardPage;