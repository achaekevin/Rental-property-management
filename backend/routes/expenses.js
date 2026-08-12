const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const { verifyToken } = require('../middleware/auth');

// GET /api/expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().populate('propertyId', 'name address');
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/expenses
router.post('/', verifyToken, async (req, res) => {
  try {
    const expense = new Expense(req.body);
    const savedExpense = await expense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
