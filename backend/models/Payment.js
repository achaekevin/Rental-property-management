const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  amount: { type: Number, required: true },
  paymentMethod: { 
    type: String, 
    enum: ['M-Pesa', 'ACH', 'Credit Card', 'Cash', 'Bank Transfer'],
    default: 'M-Pesa'
  },
  reference: { type: String, default: '' },
  checkoutRequestId: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  invoiceNumber: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['SUCCESS', 'PENDING', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
