const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const Unit = require('../models/Unit');
const Tenant = require('../models/Tenant');
const Payment = require('../models/Payment');
const Expense = require('../models/Expense');
const Maintenance = require('../models/Maintenance');

// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const totalUnits = await Unit.countDocuments();
    const occupiedUnits = await Unit.countDocuments({ status: 'OCCUPIED' });
    const vacantUnits = await Unit.countDocuments({ status: 'AVAILABLE' });
    const totalTenants = await Tenant.countDocuments();

    // Total revenue from successful payments
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg[0] ? revenueAgg[0].total : 0;

    // Total expenses
    const expenseAgg = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalExpenses = expenseAgg[0] ? expenseAgg[0].total : 0;

    // Maintenance ticket stats
    const openMaintenance = await Maintenance.countDocuments({ status: { $in: ['OPEN', 'ASSIGNED', 'IN_PROGRESS'] } });

    res.json({
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
      totalTenants,
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      openMaintenance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
