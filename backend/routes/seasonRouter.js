const Router = require('express');
const router = new Router();
const seasonController = require('../controllers/seasonController');
const checkRole = require("../middleware/checkRoleMiddleware");

// #swagger.tags = ['Season']
router.post('/createOrEdit',checkRole('ADMIN'), seasonController.createOrEditSeason);
router.post('/seasons', seasonController.getSeasons);
router.get('/season/:id', seasonController.getSeason);

module.exports = router;