const express = require('express');
const router = express.Router();
const Payment = require('../model/Payment');

// POST /payments - create a new payment
router.post('/', async (req, res) => {
  try {
    const { paid_at, status, method, booking_id } = req.body;
    const payment = await Payment.create({
      paid_at,
      status,
      method,
      booking_id,
    });
    res.status(201).json({ message: 'Payment saved', payment });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Failed to save payment' });
  }
});

// You can add GET, PUT, DELETE as needed

module.exports = router;
