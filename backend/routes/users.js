const express = require('express');
const router = express.Router();
const { User, Organization } = require('../models');
const { verifyToken, authorizeRoles, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(authorizeRoles('SUPER_ADMINISTRATOR', 'PROPERTY_MANAGER'));
router.use(enforceResourceAccess('users'));

// GET /api/users - List users with resource-level scoping
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.user.role === 'PROPERTY_MANAGER' && req.user.organizationId) {
      where.organizationId = req.user.organizationId;
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      include: [{ model: Organization, as: 'organization', attributes: ['id', 'name'] }]
    });

    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.role === 'PROPERTY_MANAGER' && user.organizationId !== req.user.organizationId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access to users in another organization is prohibited.' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users - Create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, phone, organizationId } = req.body;
    const targetOrgId = req.user.role === 'SUPER_ADMINISTRATOR' ? organizationId : req.user.organizationId;

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'TENANT',
      phone: phone || '',
      organizationId: targetOrgId || null
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/users/:id - Update user
router.patch('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.user.role === 'PROPERTY_MANAGER' && user.organizationId !== req.user.organizationId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Access to users in another organization is prohibited.' });
    }

    await user.update(req.body);
    res.json({ success: true, message: 'User updated successfully', data: user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/users/:id - Delete user
router.delete('/:id', authorizeRoles('SUPER_ADMINISTRATOR'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    await user.destroy();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
