const express = require('express');
const router = express.Router();
const { Payment, Tenant, Property, Unit } = require('../models');
const { verifyToken } = require('../middleware/auth');

// GET /api/payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Tenant, as: 'tenant', attributes: ['id', 'name', 'email'] },
        { model: Property, as: 'property', attributes: ['id', 'name'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] }
      ]
    });
    const result = payments.map(p => {
      const data = p.toJSON();
      data._id = p.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments (Manual payment recording)
router.post('/', verifyToken, async (req, res) => {
  try {
    const payment = await Payment.create({
      ...req.body,
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      status: req.body.status || 'SUCCESS'
    });
    const data = payment.toJSON();
    data._id = payment.id;
    res.status(201).json(data);
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
    const payment = await Payment.create({
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

    res.status(200).json({
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      MerchantRequestID: `MR_${Date.now()}`,
      CheckoutRequestID: checkoutRequestId,
      CustomerMessage: `STK Push sent to ${phoneNumber}. Please enter your M-Pesa PIN to complete payment of KES ${amount}.`,
      paymentId: payment.id,
      _id: payment.id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments/mpesa/callback (M-Pesa Callback Endpoint)
router.post('/mpesa/callback', async (req, res) => {
  try {
    const { CheckoutRequestID, ResultCode, ResultDesc } = req.body;
    const payment = await Payment.findOne({ where: { checkoutRequestId: CheckoutRequestID } });

    if (payment) {
      const newStatus = (ResultCode === 0) ? 'SUCCESS' : 'FAILED';
      await payment.update({
        status: newStatus,
        paidAt: new Date()
      });
    }

    res.json({ status: 'Callback processed', ResultDesc });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
