const { Router } = require('express');
const usersController = require('../controllers/usersController');
const Auth = require('../controllers/auth');

const router = Router();

router.get('/', usersController.getAll);
router.get('/:username', usersController.getOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);
router.post('/register', Auth.register);
router.post('/login', Auth.login);

module.exports = router;
