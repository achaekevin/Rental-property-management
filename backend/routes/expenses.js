const express = require('express');
const router = express.Router();
const { Expense, Property, Unit } = require('../models');
const { verifyToken, requirePermission, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(enforceResourceAccess('expenses'));

router.get('/', requirePermission('expense.view'), async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'PROPERTY_MANAGER' && req.user.organizationId) {
      where.organizationId = req.user.organizationId;
    }
    const expenses = await Expense.findAll({
      where,
      include: [{ model: Property, as: 'property', attributes: ['id', 'name'] }]
    });
    res.json({ success: true, count: expenses.length, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requirePermission('expense.create'), async (req, res) => {
  try {
    if (req.user.role === 'PROPERTY_MANAGER') {
      req.body.organizationId = req.user.organizationId;
    }
    const expense = await Expense.create(req.body);
    res.status(201).json({ success: true, message: 'Expense recorded successfully', data: expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', requirePermission('expense.update'), async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    await expense.update(req.body);
    res.json({ success: true, message: 'Expense updated successfully', data: expense });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
