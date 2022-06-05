const Router = require('express');
const router = new Router();
const resultController = require('../controllers/resultController');
const checkRole = require("../middleware/checkRoleMiddleware");

// #swagger.tags = ['Result']
router.post('/:id', checkRole('ADMIN'), resultController.result);
router.post('/:id/save', checkRole('ADMIN'), resultController.resultSave);
router.post('/:id/table', checkRole('ADMIN'), resultController.resultTable);
//router.post('/:id/table', checkRole('ADMIN'), resultController.resultTable);

module.exports = router;