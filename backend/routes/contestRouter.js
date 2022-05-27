const Router = require('express');
const router = new Router();
const contestController = require('../controllers/contestController');

// #swagger.tags = ['Contest']
router.get('/contestData', contestController.contestData);

module.exports = router;