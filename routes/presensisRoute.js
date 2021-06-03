const { Router } = require('express');
const presensisController = require('../controllers/presensisController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verifyRole('admin'), presensisController.getAll);
router.get('/:id', authenticateToken, presensisController.getOne);
router.post('/check', authenticateToken, presensisController.checkPresensi);
// router.post('/add-link-vidcon', authenticateToken, verifyRole('admin'), presensisController.addLinkVidcon);
// router.post('/add-link-record', authenticateToken, verifyRole('admin'), presensisController.addLinkRecord);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);

module.exports = router;
