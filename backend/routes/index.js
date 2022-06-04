const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const contestRouter = require('./contestRouter');
const seasonRouter = require('./seasonRouter');
const applicationRouter = require('./applicationRouter');
const voteRouter = require('./voteRouter');

router.use('/user', userRouter);
router.use('/contest', contestRouter);
router.use('/season', seasonRouter);
router.use('/application', applicationRouter);
router.use('/vote', voteRouter);

module.exports = router;