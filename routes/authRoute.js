const { Router } = require('express');
const Auth = require('../controllers/auth');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');

const router = Router();

router.post('/login', Auth.login);
router.post('/logout', Auth.logout);

module.exports = router;
