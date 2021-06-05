const { Router } = require('express');
const jadwalController = require('../controllers/jadwalsController');
const { authenticateToken, authenticateTokenIPB } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

// router.get('/', authenticateTokenIPB, verifyRole("Admin"), jadwalController.getAll);
router.get('/', authenticateToken, verifyRole("Admin"), jadwalController.getAll);
// router.get('', authenticateToken, jadwalController.get);
// router.get('/:id', authenticateToken, jadwalController.getOne);
// router.post('/insert', authenticateToken, verifyRole('admin'), jadwalController.insert);
// router.post('/insert-pertemuan/:id', authenticateToken, verifyRole('admin'), jadwalController.insertPertemuan);
// router.post('/insert-mahasiswa/:id', authenticateToken, verifyRole('admin'), jadwalController.insertMahasiswa);
// router.delete('/:id', authenticateToken, verifyRole('admin'), jadwalController.delete);

module.exports = router;
