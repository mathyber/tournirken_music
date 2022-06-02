const Router = require('express');
const router = new Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

// #swagger.tags = ['Application']
router.post('/new', authMiddleware, applicationController.newApplication);
router.post('/applications', checkRole('ADMIN'), applicationController.getApplications);
router.get('/:id', checkRole('ADMIN'), applicationController.getApplication);

module.exports = router;