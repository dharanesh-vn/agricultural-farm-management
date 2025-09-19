const jwt = require('jsonwebtoken');
const User = require('../models/User'); // It needs the User model to find the user from the token

const protect = async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get the token from the header (Bearer TOKEN -> TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user in the database using the ID from the token
      // We exclude the password from the data we attach to the request
      req.user = await User.findById(decoded.id).select('-password');

      // 5. If successful, allow the request to continue to the next function (the controller)
      next();
    } catch (error) {
      // 6. If the token is invalid, send an error
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If there is no token at all, send an error
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };