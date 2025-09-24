const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckoutSession } = require('../controllers/paymentController');

// Route for a buyer to create a real Stripe payment session
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;