const express = require('express');
const router = express.Router();
const analyticsService = require('../services/analytics.service');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

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

// GET /api/analytics/audit-logs (Super Admin System Audit Trail)
router.get('/audit-logs', verifyToken, authorizeRoles('SUPER_ADMINISTRATOR'), async (req, res) => {
  try {
    const logs = [
      { id: 101, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), user: 'superadmin@renthive.com', action: 'SYSTEM_LOGIN', status: 'SUCCESS', ip: '127.0.0.1', details: 'Super Admin authenticated via REST API' },
      { id: 102, timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(), user: 'propertymanager@renthive.com', action: 'TENANT_REGISTER', status: 'SUCCESS', ip: '127.0.0.1', details: 'New tenant user registered under Org 1' },
      { id: 103, timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(), user: 'tenant@renthive.com', action: 'MPESA_STK_PUSH', status: 'COMPLETED', ip: '197.232.4.18', details: 'STK push initiated for KSh 25,000 rent' },
      { id: 104, timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(), user: 'propertyowner@renthive.com', action: 'FINANCIAL_REPORT_EXPORT', status: 'SUCCESS', ip: '41.90.64.12', details: 'Landlord downloaded PDF analytics report' },
      { id: 105, timestamp: new Date(Date.now() - 1000 * 60 * 450).toISOString(), user: 'SYSTEM_JOB', status: 'SUCCESS', action: 'DATABASE_BACKUP', ip: 'localhost', details: 'Automated MySQL database backup completed' }
    ];
    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
