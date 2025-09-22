const express = require('express');
const router = express.Router();
const { getListings } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getListings);

module.exports = router;