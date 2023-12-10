import { Router } from 'express';
import UserController from '../controllers/userController.js';
import AuthSchema from '../requestSchema/authSchema.js';

const router = Router();
router.post('/register',AuthSchema.register,UserController.register);
router.post('/login', AuthSchema.login, UserController.login);
router.post('/refresh-token', AuthSchema.refreshToken, UserController.refreshToken);

export default router;