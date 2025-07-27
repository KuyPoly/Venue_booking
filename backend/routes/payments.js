const express = require('express');
const router = express.Router();
const Payment = require('../model/Payment');
const Booking = require('../model/Booking');
const { generateABAQR } = require('../controllers/abaPay');

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
    // After payment, update booking status to 'confirmed'
    if (booking_id) {
      await Booking.update(
        { status: 'confirmed' },
        { where: { booking_id } }
      );
    }
    res.status(201).json({ message: 'Payment saved', payment });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({ error: 'Failed to save payment' });
  }
});

// Generate ABA QR Code
router.post('/aba-qr', generateABAQR);

// You can add GET, PUT, DELETE as needed

module.exports = router;
