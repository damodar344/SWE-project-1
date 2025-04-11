const jwt = require('jsonwebtoken');
const User = require('../models/User');
const express = require("express")
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Registration route
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({email: email });
      if (existingUser) {
        return res.status(400).json({ message: 'Username or email already exists' });
      }
  
      // Create a new user
      const user = new User({ email, password });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Login route
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by username
      const user = await User.findOne({ email:email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare provided password with hashed password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Protected route example (requires authentication)
  router.get('/profile', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ profile: { id: user._id, email: user.email } });
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  });
  
  module.exports = router;