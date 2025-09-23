// Note: We no longer need the 'stripe' package for this simulation
const Contract = require('../models/Contract');

/**
 * @desc    SIMULATE a successful payment for a contract
 * @route   POST /api/payments/create-checkout-session
 * @access  Private (Buyer)
 */
const createCheckoutSession = async (req, res, next) => {
  try {
    const { contractId } = req.body;
    const userId = req.user.id;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      res.status(404);
      throw new Error('Contract not found.');
    }

    // --- Security Checks ---
    if (contract.buyer.toString() !== userId.toString()) {
      res.status(403);
      throw new Error('You are not authorized to pay for this contract.');
    }
    if (contract.paymentStatus === 'paid') {
        res.status(400);
        throw new Error('This contract has already been paid for.');
    }

    // --- PAYMENT SIMULATION ---
    // Instead of creating a Stripe session, we instantly mark the contract as paid
    // and ready for the farmer to ship.
    contract.paymentStatus = 'paid';
    contract.status = 'awaiting_shipment';
    await contract.save();

    console.log(`✅ SIMULATED successful payment for contract ID: ${contractId}`);
    
    // Send back the updated contract as confirmation
    res.status(200).json(contract);

  } catch (error) {
    next(error);
  }
};

// The test route is no longer needed in this simplified version
module.exports = { createCheckoutSession };