const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { propertyValidation } = require('../validators/property.validator');
const { verifyToken, requirePermission, enforceResourceAccess } = require('../middleware/auth');

router.use(verifyToken);
router.use(enforceResourceAccess('properties'));

router.get('/', requirePermission('property.view'), (req, res) => propertyController.getAll(req, res));
router.get('/:id', requirePermission('property.view'), (req, res) => propertyController.getById(req, res));
router.post('/', requirePermission('property.create'), propertyValidation, (req, res) => propertyController.create(req, res));
router.put('/:id', requirePermission('property.update'), (req, res) => propertyController.update(req, res));
router.delete('/:id', requirePermission('property.delete'), (req, res) => propertyController.delete(req, res));

module.exports = router;
