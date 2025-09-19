const Contract = require('../models/Contract');

const getMyContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.find({ $or: [{ farmer: req.user._id }, { buyer: req.user._id }] })
      .populate('farmer', 'name').populate('buyer', 'name').sort({ updatedAt: -1 });
    res.json(contracts);
  } catch (error) { next(error); }
};

const getContractById = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('farmer', 'name email').populate('buyer', 'name email');
    if (!contract) { res.status(404); throw new Error('Contract not found'); }
    if (contract.farmer._id.toString() !== req.user._id.toString() && contract.buyer._id.toString() !== req.user._id.toString()) {
      res.status(403); throw new Error('User not authorized to view this contract');
    }
    res.json(contract);
  } catch (error) { next(error); }
};

const updateContractStatus = async (req, res, next) => {
  try {
    const { status: newStatus } = req.body;
    const contract = await Contract.findById(req.params.id);
    if (!contract) { res.status(404); throw new Error('Contract not found'); }

    const isFarmer = contract.farmer.toString() === req.user._id.toString();
    const isBuyer = contract.buyer.toString() === req.user._id.toString();
    if (!isFarmer && !isBuyer) { res.status(403); throw new Error('Not authorized to update'); }

    const validTransitions = { pending: 'awaiting_shipment', awaiting_shipment: 'shipped', shipped: 'completed' };
    const rolePermissions = { pending: 'buyer', awaiting_shipment: 'farmer', shipped: 'buyer' };
    
    if (validTransitions[contract.status] !== newStatus || rolePermissions[contract.status] !== req.user.role) {
      res.status(400); throw new Error('Invalid status transition for your role.');
    }

    contract.status = newStatus;
    await contract.save();
    const updatedContract = await Contract.findById(contract._id).populate('farmer', 'name email').populate('buyer', 'name email');
    res.json(updatedContract);
  } catch (error) { next(error); }
};

module.exports = { getMyContracts, getContractById, updateContractStatus };