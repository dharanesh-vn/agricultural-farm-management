const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
// --- FIX: Import all three functions from the controller ---
const { 
    createCheckoutSession, 
    testStripeConnection, 
    stripeWebhook 
} = require('../controllers/paymentController');

// Route to test the Stripe connection
router.get('/test-stripe', protect, testStripeConnection);

// Route for a buyer to create a payment session
router.post('/create-checkout-session', protect, createCheckoutSession);

// Route for Stripe to send payment confirmation webhooks
// This route needs the raw request body, so we add the middleware here.
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;