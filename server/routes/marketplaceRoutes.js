const express = require('express');
const router = express.Router();
const {
  createListing,
  getListings,
  getListingById,
  deleteListing
} = require('../controllers/marketplaceController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createListing)
  .get(getListings);

router.route('/:id')
  .get(getListingById)
  .delete(protect, deleteListing);

module.exports = router;