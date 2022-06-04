const Router = require('express');
const router = new Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

// #swagger.tags = ['Application']
router.post('/new', authMiddleware, applicationController.newApplication);
router.post('/applications', checkRole('ADMIN'), applicationController.getApplications);
router.get('/:id', checkRole('ADMIN'), applicationController.getApplication);
router.post('/status', checkRole('ADMIN'), applicationController.setStatusApplication);
router.post('/setStages', checkRole('ADMIN'), applicationController.setStagesApplications);

module.exports = router;