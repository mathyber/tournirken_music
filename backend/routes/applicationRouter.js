const Router = require('express');
const router = new Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require("../middleware/authMiddleware");

// #swagger.tags = ['Application']
router.post('/new', authMiddleware, applicationController.newApplication);

module.exports = router;