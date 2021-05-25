const { Router } = require('express');
const usersController = require('../controllers/usersController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verificateRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verificateRole('admin'), usersController.getAll);
router.get('/:username', authenticateToken, verificateRole('admin'), usersController.getOne);
router.put('/:id', authenticateToken, verificateRole('admin'), usersController.update);
router.delete('/:id', authenticateToken, verificateRole('admin'), usersController.delete);

module.exports = router;
