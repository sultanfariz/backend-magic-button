const { Router } = require('express');
const presensisController = require('../controllers/presensisController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verificateAdmin } = require('../helper/roleChecker');

const router = Router();

router.post('/add-link-vidcon', authenticateToken, verificateAdmin, presensisController.addLinkVidcon);
router.post('/add-link-record', authenticateToken, verificateAdmin, presensisController.addLinkRecord);
// router.post('/add-admin', authenticateToken, adminsController.addAdmin);
router.get('/', authenticateToken, verificateAdmin, presensisController.getAll);
// router.get('/:username', authenticateToken, usersController.getOne);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);

module.exports = router;
