const { Router } = require('express');
const linksController = require('../controllers/linksController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verificateAdmin } = require('../helper/roleChecker');

const router = Router();

router.post('/add-link-vidcon', authenticateToken, verificateAdmin, linksController.addLinkVidcon);
// router.post('/add-admin', authenticateToken, adminsController.addAdmin);
router.get('/', authenticateToken, verificateAdmin, linksController.getAll);
// router.get('/:username', authenticateToken, usersController.getOne);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);

module.exports = router;
