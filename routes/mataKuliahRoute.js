const { Router } = require('express');
const mataKuliahController = require('../controllers/mataKuliahController');
const { authenticateToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verifyRole('admin'), mataKuliahController.getAll);
router.get('/:id', authenticateToken, verifyRole('admin'), mataKuliahController.getOne);
router.post('/insert', authenticateToken, verifyRole('admin'), mataKuliahController.insert);
router.delete('/:id', authenticateToken, verifyRole('admin'), mataKuliahController.delete);

module.exports = router;
