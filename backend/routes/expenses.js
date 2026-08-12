const express = require('express');
const router = express.Router();
const { Expense, Property, Unit } = require('../models');
const { verifyToken } = require('../middleware/auth');

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      include: [
        { model: Property, as: 'property', attributes: ['id', 'name', 'address'] },
        { model: Unit, as: 'unit', attributes: ['id', 'unitNumber'] }
      ]
    });
    const result = expenses.map(e => {
      const data = e.toJSON();
      data._id = e.id;
      return data;
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/expenses
router.post('/', verifyToken, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    const data = expense.toJSON();
    data._id = expense.id;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
