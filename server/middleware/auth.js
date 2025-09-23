const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this is the correct path to your new User model

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- THIS IS THE CRITICAL FIX ---
      // The decoded token contains the user's MongoDB ObjectId in the 'id' field.
      // We must use this 'id' to find the user in the database.
      // The .select('-password') part ensures we don't include the hashed password.
      req.user = await User.findById(decoded.id).select('-password');
      // --- END OF FIX ---

      if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next step (e.g., the controller)
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

module.exports = { protect };