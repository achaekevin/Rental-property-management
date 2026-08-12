const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { paymentValidation } = require('../validators/payment.validator');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, (req, res) => paymentController.getAll(req, res));
router.post('/', verifyToken, paymentValidation, (req, res) => paymentController.create(req, res));
router.post('/mpesa/stkpush', verifyToken, (req, res) => paymentController.mpesaStkPush(req, res));
router.post('/mpesa/callback', (req, res) => {
  console.log('Received M-Pesa Callback:', JSON.stringify(req.body));
  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
});

module.exports = router;
