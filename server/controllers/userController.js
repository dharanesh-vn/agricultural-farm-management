// server/controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

// Function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token will be valid for 30 days
    });
};

// @desc    Register a new user
const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // 1. Check if user already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the new user in the database
        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || 'Admin', // Default to 'Admin' if role is not provided
        });

        // 4. Respond with user data and a token
        if (user) {
            res.status(201).json({
                _id: user.id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ username });

        // 2. If user exists, compare the entered password with the hashed password in the DB
        if (user && (await bcrypt.compare(password, user.password))) {
            // 3. If passwords match, respond with user data and a new token
            res.json({
                _id: user.id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            // If user or password do not match
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};