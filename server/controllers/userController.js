const User = require('../models/User');

const getUserProfile = async (req, res, next) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password; // The 'pre-save' hook will hash it
      }
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// --- THIS FUNCTION WAS MISSING ---
const getBuyers = async (req, res, next) => {
    try {
      const buyers = await User.find({ role: 'buyer' }).select('_id name');
      res.json(buyers);
    } catch (error) {
      next(error);
    }
};
// --- END OF FIX ---


// --- MAKE SURE ALL FUNCTIONS ARE EXPORTED ---
module.exports = { 
    getUserProfile, 
    updateUserProfile, 
    getBuyers 
};