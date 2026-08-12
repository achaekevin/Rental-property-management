const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { verifyToken } = require('../middleware/auth');

// GET /api/payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('tenantId', 'name email')
      .populate('propertyId', 'name')
      .populate('unitId', 'unitNumber');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments (Manual payment recording)
router.post('/', verifyToken, async (req, res) => {
  try {
    const payment = new Payment({
      ...req.body,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      status: req.body.status || 'SUCCESS'
    });
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/payments/mpesa/stkpush (M-Pesa STK Push Integration)
router.post('/mpesa/stkpush', async (req, res) => {
  try {
    const { phoneNumber, amount, tenantId, propertyId, unitId } = req.body;
    if (!phoneNumber || !amount) {
      return res.status(400).json({ message: 'Phone number and amount are required' });
    }

    const checkoutRequestId = `ws_CO_${Date.now()}`;
    const payment = new Payment({
      tenantId,
      propertyId,
      unitId,
      amount,
      paymentMethod: 'M-Pesa',
      phoneNumber,
      reference: `MPESA-${Date.now().toString().slice(-6)}`,
      checkoutRequestId,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      status: 'PENDING'
    });

    await payment.save();

    // Respond with STK Push Status
    res.status(200).json({
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      MerchantRequestID: `MR_${Date.now()}`,
      CheckoutRequestID: checkoutRequestId,
      CustomerMessage: `STK Push sent to ${phoneNumber}. Please enter your M-Pesa PIN to complete payment of KES ${amount}.`,
      paymentId: payment._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/mpesa/callback (M-Pesa Callback Endpoint)
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { CheckoutRequestID, ResultCode, ResultDesc } = req.body;
    const payment = await Payment.findOne({ checkoutRequestId: CheckoutRequestID });

    if (payment) {
      if (ResultCode === 0) {
        payment.status = 'SUCCESS';
        payment.paidAt = new Date();
      } else {
        payment.status = 'FAILED';
      }
      await payment.save();
    }

    res.json({ status: 'Callback processed', ResultDesc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
