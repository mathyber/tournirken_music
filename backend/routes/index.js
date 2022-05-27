const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const contestRouter = require('./contestRouter');

router.use('/user', userRouter);
router.use('/contest', contestRouter);

module.exports = router;