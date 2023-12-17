import { Router } from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import blogRoute from './blogRoutes.js';
import cartRoute from '../routes/cartRoutes.js';

const router = Router();
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/blog', blogRoute);
router.use('/cart', cartRoute);
export default router;