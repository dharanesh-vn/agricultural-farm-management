const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckoutSession } = require('../controllers/paymentController');

// This route is protected, meaning only a logged-in user can access it.
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;