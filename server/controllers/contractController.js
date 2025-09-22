const Contract = require('../models/Contract');

const getMyContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.find({ $or: [{ farmer: req.user.id }, { buyer: req.user.id }] })
      .populate('farmer', 'name').populate('buyer', 'name').sort({ updatedAt: -1 });
    res.json(contracts);
  } catch (error) { next(error); }
};

const updateContractStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const contract = await Contract.findById(req.params.id);

        if (!contract) { throw new Error('Contract not found'); }

        const userRole = req.user.role;
        const userId = req.user.id;
        let canUpdate = false;

        // Define who can make which status change
        if (status === 'shipped' && userRole === 'farmer' && contract.farmer.toString() === userId) {
            canUpdate = true;
        }
        if (status === 'completed' && userRole === 'buyer' && contract.buyer.toString() === userId) {
            canUpdate = true;
        }

        if (!canUpdate) {
            res.status(403);
            throw new Error('You are not authorized to make this status update.');
        }

        contract.status = status;
        await contract.save();
        res.json(contract);

    } catch (error) { next(error); }
};

module.exports = { getMyContracts, updateContractStatus };