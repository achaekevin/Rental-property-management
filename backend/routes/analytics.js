const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics.service');
const { verifyToken } = require('../middleware/auth');

// GET /api/analytics/stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const stats = await analyticsService.getDashboardStats(req.user);
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;
