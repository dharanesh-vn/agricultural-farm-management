const Stripe = require('stripe');
const Contract = require('../models/Contract');

// This will now work because the .env is loaded correctly
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create a real Stripe Checkout Session for a contract payment
 * @route   POST /api/payments/create-checkout-session
 * @access  Private (Buyer)
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const { contractId } = req.body;
    const userId = req.user.id;

    const contract = await Contract.findById(contractId).populate('farmer');

    if (!contract || contract.buyer.toString() !== userId.toString()) {
      res.status(404);
      throw new Error('Contract not found or you are not authorized.');
    }
    if (contract.paymentStatus === 'paid') {
        res.status(400);
        throw new Error('This contract has already been paid for.');
    }

    // Create a real checkout session with the Stripe API
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${contract.produce} (${contract.quantity} kg)`,
            description: `From seller: ${contract.farmer.name}`,
          },
          unit_amount: contract.price * 100, // Amount in paise
        },
        quantity: 1,
      }],
      metadata: { contractId: contract._id.toString() },
      success_url: `${process.env.CLIENT_URL}/app/contracts?payment_success=true`,
      cancel_url: `${process.env.CLIENT_URL}/app/contracts`,
      customer_email: req.user.email,
    });

    // Send the redirect URL back to the frontend
    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckoutSession };