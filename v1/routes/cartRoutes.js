import { Router } from 'express';
import auth from '../middlewares/authMiddleware.js';
import CartSchema from '../requestSchema/cartSchema.js';
import CartController from '../controllers/cartController.js';

const router = Router();
router.post('/add', auth, CartSchema.add, auth, CartController.add);
router.put('/update/:cartId', auth, CartSchema.add, CartController.update);
router.get('/list', auth, CartSchema.list, CartController.list);
router.delete('/delete/:cartId', auth, CartController.delete);
export default router;
