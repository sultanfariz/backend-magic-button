const { Router } = require('express');
const usersController = require('../controllers/usersController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verifyRole('admin'), usersController.getAll);
router.get('/:username', authenticateToken, verifyRole('admin'), usersController.getOne);
router.put('/:id', authenticateToken, verifyRole('admin'), usersController.update);
router.delete('/:id', authenticateToken, verifyRole('admin'), usersController.delete);

module.exports = router;
