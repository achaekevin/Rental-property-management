const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitNumber: { type: String, required: true },
  type: { type: String, default: 'Apartment' },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  rentAmount: { type: Number, required: true },
  depositAmount: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE'],
    default: 'AVAILABLE'
  },
  amenities: [String]
}, { timestamps: true });

module.exports = mongoose.model('Unit', UnitSchema);
