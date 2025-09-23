const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createCheckoutSession } = require('../controllers/paymentController');

// Route for a buyer to create a simulated payment session
router.post('/create-checkout-session', protect, createCheckoutSession);

// The webhook route is no longer needed for the simulation
// router.post('/webhook', ...);

module.exports = router;