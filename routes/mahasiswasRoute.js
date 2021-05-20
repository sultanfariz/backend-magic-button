const { Router } = require('express');
const mahasiswasController = require('../controllers/mahasiswasController');
const Auth = require('../controllers/auth');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');

const router = Router();

router.post(
  '/add-mahasiswa',
  authenticateToken,
  mahasiswasController.addMahasiswa
);
// router.post('/add-admin', authenticateToken, adminsController.addAdmin);
// router.get('/', usersController.getAll);
// router.get('/:username', authenticateToken, usersController.getOne);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);
// router.post('/register', Auth.register);
// router.post('/login', Auth.login);
// router.post('/logout', Auth.logout);

module.exports = router;
