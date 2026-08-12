const express = require('express');
const router = express.Router();
const { Role, Permission, RolePermission } = require('../models');
const { verifyToken, authorizeRoles, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(authorizeRoles('SUPER_ADMINISTRATOR'));
router.use(enforceResourceAccess('roles'));

// GET /api/roles - List all system roles and permissions
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{ model: Permission, as: 'permissions', through: { attributes: [] } }]
    });
    res.json({ success: true, count: roles.length, data: roles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/roles - Create role
router.post('/', async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ success: true, message: 'Role created successfully', data: role });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
