const Router = require('express');
const router = new Router();
const voteController = require('../controllers/voteController');
const authMiddleware = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRoleMiddleware");

// #swagger.tags = ['Vote']
router.post('/voteSystem', authMiddleware, voteController.voteSystem);
router.post('/:id', authMiddleware, voteController.vote);
router.delete('/:id/:userId', checkRole('ADMIN'), voteController.deleteVote);

module.exports = router;