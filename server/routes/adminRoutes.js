const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  getDisputedContracts,
  resolveDispute
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

router.use(protect, authorize('admin')); // Protect and authorize all routes in this file

router.route('/users').get(getAllUsers);
router.route('/users/:id').put(updateUser);
router.route('/disputes').get(getDisputedContracts);
router.route('/disputes/:id/resolve').put(resolveDispute);

module.exports = router;