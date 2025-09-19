const Stripe = require('stripe');
const Contract = require('../models/Contract');
const Payment = require('../models/Payment'); // <-- new model

// Initialize Stripe with your secret key from the .env file
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create a Stripe Checkout Session for a contract payment
 * @route   POST /api/payments/create-checkout-session
 * @access  Private (Buyer)
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const { contractId } = req.body;
    const userId = req.user._id;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      res.status(404);
      throw new Error('Contract not found.');
    }

    // Security check: ensure the person paying is the buyer
    if (contract.buyer.toString() !== userId.toString()) {
      res.status(403);
      throw new Error('You are not authorized to pay for this contract.');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'inr', // Change if needed
          product_data: {
            name: contract.produce,
            description: `Payment for ${contract.quantity} kg.`,
          },
          // Stripe requires the amount in the smallest unit (paise for INR)
          unit_amount: contract.price * 100,
        },
        quantity: 1,
      }],
      client_reference_id: contractId, // so we can update contract later
      success_url: `${process.env.CLIENT_URL}/contracts/${contractId}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/contracts/${contractId}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Handle incoming webhooks from Stripe to confirm payments
 * @route   POST /api/payments/webhook
 * @access  Public (Stripe verifies)
 */
const stripeWebhook = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body required
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`❌ Webhook signature verification failed:`, err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const contractId = session.client_reference_id;

    console.log(`✅ Payment successful for contract ID: ${contractId}`);

    // Update the contract
    const contract = await Contract.findByIdAndUpdate(
      contractId,
      { status: 'awaiting_shipment' },
      { new: true }
    );

    if (contract) {
      // Save a payment record
      await Payment.create({
        contract: contract._id,
        payer: contract.buyer,
        payee: contract.farmer,
        amount: contract.price,
        currency: session.currency,
        status: 'success',
        stripeSessionId: session.id,
      });
    }
  }

  res.json({ received: true });
};

/**
 * @desc    Get payments for a given contract
 * @route   GET /api/payments/:contractId
 * @access  Private (Farmer/Buyer of the contract)
 */
const getPaymentsByContract = async (req, res, next) => {
  try {
    const { contractId } = req.params;

    const payments = await Payment.find({ contract: contractId })
      .populate('payer', 'name email')
      .populate('payee', 'name email');

    res.json(payments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
  getPaymentsByContract,
};
