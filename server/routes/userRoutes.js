const express = require('express');
const router = express.Router();
// This import must be correct
const { registerUser, loginUser } = require('../controllers/userController');

// Defines the '/register' part of the URL
router.post('/register', registerUser);

// Defines the '/login' part of the URL
router.post('/login', loginUser); // <-- IS THIS LINE HERE?

module.exports = router; // <-- IS THIS LINE HERE?