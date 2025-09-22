const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckoutSession } = require('../controllers/paymentController');

// FULL PATH: POST /api/payments/create-checkout-session
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;