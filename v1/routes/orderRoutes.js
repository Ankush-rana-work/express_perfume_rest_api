import { Router } from 'express';
import auth from '../middlewares/authMiddleware.js';
import OrderController from '../controllers/orderController.js';
import OrderSchema from '../requestSchema/orderSchema.js';

const router = Router();
router.get('/get-cart-detail', auth, OrderController.cartDetail);
router.post('/checkout', auth, OrderSchema.checkoutSession, OrderController.checkoutSession);
export default router;
