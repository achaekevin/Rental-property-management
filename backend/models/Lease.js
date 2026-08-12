const mongoose = require('mongoose');

const LeaseSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  depositAmount: { type: Number, default: 0 },
  paymentFrequency: { type: String, default: 'Monthly' },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'EXPIRING', 'EXPIRED', 'TERMINATED', 'RENEWED'],
    default: 'ACTIVE'
  },
  documents: [String]
}, { timestamps: true });

module.exports = mongoose.model('Lease', LeaseSchema);
