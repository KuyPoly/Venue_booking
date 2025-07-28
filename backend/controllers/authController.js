const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const axios = require('axios');
require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, dob, address, gender, role } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phoneNumber,
      password: hashedPassword,
      dob,
      address,
      gender,
      role: role || 'customer'
    });

    // --- SEND WELCOME EMAIL VIA EMAILJS ---
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY, // or PRIVATE_KEY if using server-side
      template_params: {
        to_email: email,
        to_name: firstName,
        // Add more params as defined in your EmailJS template
      }
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include user_id in response
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Make sure we return the correct user_id
    res.json({
      token,
      user: {
        id: user.user_id, // This should match what frontend expects
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.profile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        dob: user.dob,
        address: user.address,
        gender: user.gender,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};