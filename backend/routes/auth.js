const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { registerValidation, loginValidation } = require('../validators/auth.validator');
const { verifyToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', registerValidation, (req, res, next) => authController.register(req, res, next));

// POST /api/auth/login
router.post('/login', loginValidation, (req, res, next) => authController.login(req, res, next));

// GET /api/auth/me
router.get('/me', verifyToken, (req, res, next) => authController.me(req, res, next));

module.exports = router;
