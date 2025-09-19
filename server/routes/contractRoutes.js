const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMyContracts, getContractById, updateContractStatus } = require('../controllers/contractController');

router.route('/').get(protect, getMyContracts);
router.route('/:id').get(protect, getContractById);
router.route('/:id/status').put(protect, updateContractStatus);

module.exports = router;