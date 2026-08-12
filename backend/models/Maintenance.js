const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Plumbing', 'Electrical', 'HVAC', 'Appliance', 'Structural', 'Other'],
    default: 'Plumbing'
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: { 
    type: String, 
    enum: ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
    default: 'OPEN'
  },
  assignedTo: { type: String, default: '' },
  cost: { type: Number, default: 0 },
  photos: [String],
  completionDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
