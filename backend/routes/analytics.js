const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Property, Unit, Tenant, Payment, Expense, Maintenance } = require('../models');

// GET /api/analytics/stats
router.get('/stats', async (req, res) => {
  try {
    const totalProperties = await Property.count();
    const totalUnits = await Unit.count();
    const occupiedUnits = await Unit.count({ where: { status: 'OCCUPIED' } });
    const vacantUnits = await Unit.count({ where: { status: 'AVAILABLE' } });
    const totalTenants = await Tenant.count();

    // Total revenue from successful payments
    const totalRevenue = (await Payment.sum('amount', { where: { status: 'SUCCESS' } })) || 0;

    // Total expenses
    const totalExpenses = (await Expense.sum('amount')) || 0;

    // Maintenance ticket stats
    const openMaintenance = await Maintenance.count({
      where: {
        status: {
          [Op.in]: ['OPEN', 'ASSIGNED', 'IN_PROGRESS']
        }
      }
    });

    res.json({
      totalProperties,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
      totalTenants,
      totalRevenue: Number(totalRevenue),
      totalExpenses: Number(totalExpenses),
      netIncome: Number(totalRevenue) - Number(totalExpenses),
      openMaintenance
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
