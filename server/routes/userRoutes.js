const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const {
  getUserProfile,
  updateUserProfile,
  getBuyers
} = require('../controllers/userController');

// Defines GET /api/users/profile and PUT /api/users/profile
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Defines GET /api/users/buyers, only accessible by farmers
router.route('/buyers')
  .get(protect, authorize('farmer'), getBuyers);

module.exports = router;