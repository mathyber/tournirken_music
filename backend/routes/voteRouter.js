const Router = require('express');
const router = new Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require("../middleware/authMiddleware");

// #swagger.tags = ['Vote']
router.post('/voteSystem', authMiddleware, voteController.voteSystem);
router.post('/:id', authMiddleware, voteController.vote);

module.exports = router;