const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckoutSession, stripeWebhook } = require('../controllers/paymentController');
router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
module.exports = router;