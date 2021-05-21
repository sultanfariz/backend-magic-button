const { Router } = require('express');
const adminsController = require('../controllers/adminsController');
const Auth = require('../controllers/auth');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { checkAdmin } = require('../helper/roleChecker');

const router = Router();

router.post('/add-admin', authenticateToken, checkAdmin, adminsController.addAdmin);
// router.get('/', usersController.getAll);
// router.get('/:username', authenticateToken, usersController.getOne);
// router.put('/:id', authenticateToken, usersController.update);
// router.delete('/:id', authenticateToken, usersController.delete);
// router.post('/register', Auth.register);
// router.post('/login', Auth.login);
// router.post('/logout', Auth.logout);

//test middleware
router.post('/', authenticateToken, checkAdmin, async function (req, res, next) {
  res.status(201).json({ message: 'OK' });
});

module.exports = router;
