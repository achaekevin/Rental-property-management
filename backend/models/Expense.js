const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  category: { 
    type: String, 
    enum: ['Maintenance', 'Utilities', 'Insurance', 'Taxes', 'Repairs', 'Other'],
    required: true 
  },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  receiptUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
