const { Router } = require('express');
const adminsController = require('../controllers/adminsController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');
const { verifyRole } = require('../helper/roleVerification');

const router = Router();

router.post('/', authenticateToken, verifyRole('admin'), adminsController.addAdmin);

module.exports = router;
