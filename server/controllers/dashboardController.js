const Contract = require('../models/Contract');

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const contracts = await Contract.find({ $or: [{ farmer: userId }, { buyer: userId }] }).populate('farmer', 'name').populate('buyer', 'name').sort({ updatedAt: -1 });

    const actionItems = [];
    const recentSales = [];
    const winningBids = [];

    contracts.forEach(contract => {
      // --- Generate "Action Required" Notifications ---
      if (userRole === 'buyer' && contract.status === 'pending') {
        actionItems.push({ text: `Awaiting your payment for "${contract.produce}" from ${contract.farmer.name}.`, contractId: contract._id });
      }
      if (userRole === 'farmer' && contract.status === 'awaiting_shipment') {
        actionItems.push({ text: `Payment secured for "${contract.produce}". Ready for shipment to ${contract.buyer.name}.`, contractId: contract._id });
      }
      if (userRole === 'buyer' && contract.status === 'shipped') {
        actionItems.push({ text: `Your order for "${contract.produce}" has shipped. Please confirm upon delivery.`, contractId: contract._id });
      }
      
      // --- Generate Widget Data (for completed transactions) ---
      if (contract.status === 'completed') {
        if (userRole === 'farmer') {
          recentSales.push({ itemName: contract.produce, finalPrice: contract.price, buyerName: contract.buyer.name });
        }
        if (userRole === 'buyer') {
          winningBids.push({ itemName: contract.produce, finalPrice: contract.price, farmerName: contract.farmer.name });
        }
      }
    });
    
    res.json({
      actionItems,
      displayWidgets: {
        recentSales: recentSales.slice(0, 5),
        winningBids: winningBids.slice(0, 5)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardData };