const User = require('../models/User');
const Contract = require('../models/Contract');

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a user's role or status
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.role = req.body.role || user.role;
            const updatedUser = await user.save();
            res.json(updatedUser);
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all disputed contracts
 * @route   GET /api/admin/disputes
 * @access  Private/Admin
 */
const getDisputedContracts = async (req, res, next) => {
  try {
    const contracts = await Contract.find({ status: 'disputed' })
      .populate('farmer', 'name email')
      .populate('buyer', 'name email');
    res.json(contracts);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resolve a disputed contract
 * @route   PUT /api/admin/disputes/:id/resolve
 * @access  Private/Admin
 */
const resolveDispute = async (req, res, next) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (contract && contract.status === 'disputed') {
      // Logic for resolution, e.g., marking as 'completed' or 'cancelled'
      contract.status = req.body.resolutionStatus || 'completed';
      const updatedContract = await contract.save();
      res.json(updatedContract);
    } else {
      res.status(404);
      throw new Error('Disputed contract not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  getDisputedContracts,
  resolveDispute,
};