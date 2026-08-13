const express = require('express');
const router = express.Router();
const { Property, Unit, Tenant } = require('../models');

/**
 * GET /api/public/statistics
 * Returns public, non-sensitive aggregated statistics for the landing page.
 */
router.get('/statistics', async (req, res) => {
  try {
    const properties = await Property.count();
    const units = await Unit.count();
    const occupiedUnits = await Unit.count({ where: { status: 'OCCUPIED' } });
    const tenants = await Tenant.count();
    
    // Calculate occupancy rate percentage (rounded to 1 decimal place)
    const occupancyRate = units > 0 ? parseFloat(((occupiedUnits / units) * 100).toFixed(1)) : 0;

    res.json({
      success: true,
      data: {
        properties,
        units,
        tenants,
        occupancyRate
      }
    });
  } catch (error) {
    console.error('Error fetching public statistics:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to load statistics at this time.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
