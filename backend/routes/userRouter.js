const Router = require('express');
const router = new Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

// #swagger.tags = ['User']
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);
router.get('/profile', authMiddleware, userController.profile);
router.get('/user', authMiddleware, userController.user);
router.post('/update', authMiddleware, userController.update);
router.post('/new_password', authMiddleware, userController.changePassword);
router.post('/new_role', checkRole('ADMIN'), userController.setRole);
router.post('/deactive_user', checkRole('ADMIN'), userController.deActive);

module.exports = router;