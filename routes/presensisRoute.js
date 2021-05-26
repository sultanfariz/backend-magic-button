const { Router } = require('express');
const presensisController = require('../controllers/presensisController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

// router.post('/add-link-vidcon', authenticateToken, verifyRole('admin'), presensisController.addLinkVidcon);
// router.post('/add-link-record', authenticateToken, verifyRole('admin'), presensisController.addLinkRecord);
// router.post('/add-admin', authenticateToken, adminsController.addAdmin);
router.get('/', authenticateToken, verifyRole('admin'), presensisController.getAll);
// router.get('/:username', authenticateToken, usersController.getOne);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);

module.exports = router;
