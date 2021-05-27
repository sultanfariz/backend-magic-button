const { Router } = require('express');
const mahasiswasController = require('../controllers/mahasiswasController');
const Auth = require('../controllers/auth');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.get('/', authenticateToken, verifyRole('admin'), mahasiswasController.getAll);
router.get('/:username', authenticateToken, mahasiswasController.getOne);
router.post('/insert', authenticateToken, verifyRole('admin'), mahasiswasController.insert);
router.post('/enroll-matkul', authenticateToken, verifyRole('admin'), mahasiswasController.enrollMatkul);
// router.post('/add-admin', authenticateToken, adminsController.addAdmin);
// router.get('/', usersController.getAll);
// router.get('/:username', authenticateToken, usersController.getOne);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);
// router.post('/register', Auth.register);
// router.post('/login', Auth.login);
// router.post('/logout', Auth.logout);

module.exports = router;
