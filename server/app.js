const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const Contract = require('./models/Contract');
const Stripe = require('stripe');

// --- Import ALL route files ---
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contractRoutes = require('./routes/contractRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// --- Global Middleware ---
// 1. CORS: This must come first.
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

// 2. Stripe Webhook Endpoint (special case, needs raw body)
// This route is defined here, BEFORE express.json(), to ensure it gets the raw request.
app.post('/api/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        await Contract.findByIdAndUpdate(session.metadata.contractId, {
            paymentStatus: 'paid', status: 'awaiting_shipment',
        });
    }
    res.json({ received: true });
});

// 3. Global JSON Parser for all other routes
app.use(express.json());


// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler (must be the last piece of middleware)
app.use(errorHandler);

module.exports = app;