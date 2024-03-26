import { Router } from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import blogRoute from './blogRoutes.js';
import cartRoute from '../routes/cartRoutes.js';
import orderRoutes from '../routes/orderRoutes.js';
import categoryRoutes from '../routes/categoryRoutes.js';
import homeRoutes from '../routes/homeRoutes.js';
import productReviewRoutes from './productReviewRoutes.js'

const router = Router();
router.use('/users', userRoutes);
router.use('/home', homeRoutes);
router.use('/category', categoryRoutes);
router.use('/products', productRoutes);
router.use('/reviews', productReviewRoutes);
router.use('/blog', blogRoute);
router.use('/cart', cartRoute);
router.use('/order', orderRoutes);
export default router;

// stripe listen --forward-to http://localhost:4000/api/v1/webhook/stripe/update-order
// stripe trigger payment_intent.succeeded