const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Get token from header
      token = req.headers.authorization.split(' ')[1];

      // 2. Verify the token is valid and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Find the user from the database using the ID in the token
      // This ensures the user still exists and hasn't been deleted.
      // We also remove the password from the object we attach to the request.
      req.user = await User.findById(decoded.id).select('-password');
      
      // --- CRITICAL CHECK ---
      // If the user associated with the token couldn't be found, deny access.
      if (!req.user) {
          return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 4. Success! Proceed to the actual route controller (e.g., getDashboardData)
      next();

    } catch (error) {
      // This catches errors like an invalid/expired token
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    // This catches requests that don't have a token at all
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };