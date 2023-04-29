const router = require('express').Router();
const UserController = require('../controllers/userController');
const AuthSchema = require('../requestSchema/authSchema');

router.post('/register',AuthSchema.register,UserController.register);
router.post('/login', AuthSchema.login, UserController.login);
router.post('/refresh-token', AuthSchema.refreshToken, UserController.refreshToken);

module.exports = router;