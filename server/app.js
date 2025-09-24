const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contractRoutes = require('./routes/contractRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

const app = express();

// --- Global Middleware ---
// This CORS config applies to all standard API routes (but not the webhook or sockets)
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
// This JSON parser applies to all standard API routes
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);

// Error Handler (must be the last piece of middleware)
app.use(errorHandler);

module.exports = app;