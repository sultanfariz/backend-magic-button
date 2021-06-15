const { Router } = require('express');
const linksController = require('../controllers/linksController');
const { authenticateToken, authenticateTokenIPB } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verifyRole('admin'), linksController.getAll);
router.get('/vidcon', authenticateTokenIPB, linksController.getVidconByJadwal);
router.get('/record', authenticateTokenIPB, linksController.getRecordByMatkul);
router.get('/filter', authenticateToken, linksController.filter);
router.post('/vidcon', authenticateToken, verifyRole('admin'), linksController.addLinkVidcon);
router.post('/record', authenticateToken, verifyRole('admin'), linksController.addLinkRecord);
// router.post('/add-admin', authenticateToken, adminsController.addAdmin);
// router.get('/:username', authenticateToken, usersController.getOne);
router.put('/:id', authenticateToken, linksController.update);
// router.delete('/:id', authenticateToken, usersController.delete);

module.exports = router;