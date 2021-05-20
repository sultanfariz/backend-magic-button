const { Router } = require('express');
const usersController = require('../controllers/usersController');
const { authenticateToken, generateAccessToken } = require('../helper/jwt');

const router = Router();

router.get('/', usersController.getAll);
router.get('/:username', authenticateToken, usersController.getOne);
router.put('/:id', authenticateToken, usersController.update);
router.delete('/:id', authenticateToken, usersController.delete);

// //test auth token jwt
// router.post('/', authenticateToken, async function (req, res, next) {
//   res.status(201).json({ message: 'OK' });
// });

module.exports = router;
