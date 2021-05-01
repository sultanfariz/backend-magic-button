const { Router } = require('express');
const usersController = require('../controllers/usersController');
const Auth = require('../controllers/auth');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');

const router = Router();

router.get('/', usersController.getAll);
router.get('/:username', usersController.getOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.delete);
router.post('/register', Auth.register);
router.post('/login', Auth.login);
router.post('/logout', Auth.logout);

//test auth token jwt
router.post('/',  authenticateToken, async function(req, res, next) {
    res.status(201).json({message: "OK"});
});

module.exports = router;
