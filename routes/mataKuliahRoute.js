const { Router } = require('express');
const mataKuliahController = require('../controllers/mataKuliahController');
const { authenticateToken, authenticateTokenIPB } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

// router.get('/', authenticateToken, verifyRole('admin'), mataKuliahController.getAll);
router.get('/my', authenticateTokenIPB, mataKuliahController.getMy);
router.get('/tes', authenticateTokenIPB, mataKuliahController.getMyMatkulMiddleware, mataKuliahController.tes);
// router.get('/:id', authenticateToken, verifyRole('admin'), mataKuliahController.getOne);
// router.post('/insert', authenticateToken, verifyRole('admin'), mataKuliahController.insert);
// router.delete('/:id', authenticateToken, verifyRole('admin'), mataKuliahController.delete);

module.exports = router;
