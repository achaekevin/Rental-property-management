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

const propertyValidation = [
  body('name').trim().notEmpty().withMessage('Property name is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('units').optional().isInt({ min: 0 }).withMessage('Units count must be a positive integer'),
  body('rentAmount').optional().isDecimal({ decimal_digits: '0,2' }).withMessage('Rent amount must be valid decimal'),
  validate
];

module.exports = { propertyValidation };
