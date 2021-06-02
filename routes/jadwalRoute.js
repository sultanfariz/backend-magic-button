const { Router } = require('express');
const jadwalController = require('../controllers/jadwalsController');
const { authenticateToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verifyRole('admin'), jadwalController.getAll);
// router.get('/:id', authenticateToken, verifyRole('admin'), jadwalController.getOne);
router.post('/insert', authenticateToken, verifyRole('admin'), jadwalController.insert);
// router.delete('/:id', authenticateToken, verifyRole('admin'), jadwalController.delete);

module.exports = router;
