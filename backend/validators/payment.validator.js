const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

const paymentValidation = [
  body('amount').isFloat({ gt: 0 }).withMessage('Payment amount must be greater than 0'),
  body('paymentMethod').optional().isIn(['M-Pesa', 'ACH', 'Credit Card', 'Cash', 'Bank Transfer']),
  validate
];

module.exports = { paymentValidation };
