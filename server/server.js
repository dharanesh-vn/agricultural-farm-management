require('dotenv').config();
const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');
const app = require('./app');
const connectDB = require('./config/db');
const { socketLogic } = require('./sockets/socketHandler');
const Stripe = require('stripe');
const Contract = require('./models/Contract');
connectDB();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" } });
socketLogic(io);
app.set('socketio', io);
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
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));