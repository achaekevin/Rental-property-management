const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/property.controller');
const { propertyValidation } = require('../validators/property.validator');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken);

router.get('/', (req, res) => propertyController.getAll(req, res));
router.get('/:id', (req, res) => propertyController.getById(req, res));
router.post('/', authorizeRoles('SuperAdmin', 'Admin', 'PropertyManager'), propertyValidation, (req, res) => propertyController.create(req, res));
router.put('/:id', authorizeRoles('SuperAdmin', 'Admin', 'PropertyManager'), (req, res) => propertyController.update(req, res));
router.delete('/:id', authorizeRoles('SuperAdmin', 'Admin'), (req, res) => propertyController.delete(req, res));

module.exports = router;
