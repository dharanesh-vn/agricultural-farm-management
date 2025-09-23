const Stripe = require('stripe');
const Contract = require('../models/Contract');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// --- THIS FUNCTION IS FOR TESTING YOUR API KEY ---
const testStripeConnection = async (req, res, next) => {
    try {
        await stripe.customers.list({ limit: 1 });
        res.json({ success: true, message: 'Stripe API Key is valid!' });
    } catch (error) {
        next(error);
    }
};

// --- THIS FUNCTION CREATES THE PAYMENT PAGE ---
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: `${contract.produce} (${contract.quantity} kg)` },
          unit_amount: contract.price * 100,
        },
        quantity: 1,
      }],
      metadata: { contractId: contract._id.toString() },
      success_url: `${process.env.CLIENT_URL}/app/contracts?payment_success=true`,
      cancel_url: `${process.env.CLIENT_URL}/app/contracts`,
      customer_email: req.user.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

// --- THIS IS THE MISSING WEBHOOK FUNCTION ---
/**
 * @desc    Handle incoming webhooks from Stripe to confirm payments
 * @route   POST /api/payments/webhook
 * @access  Public (verified by Stripe signature)
 */
const stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const contractId = session.metadata.contractId;

        console.log(`✅ Payment successful for contract ID: ${contractId}`);

        // Update the contract in the database
        await Contract.findByIdAndUpdate(contractId, {
            paymentStatus: 'paid',
            status: 'awaiting_shipment',
        });
    }

    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
};


// --- EXPORT ALL THREE FUNCTIONS ---
module.exports = { createCheckoutSession, testStripeConnection, stripeWebhook };