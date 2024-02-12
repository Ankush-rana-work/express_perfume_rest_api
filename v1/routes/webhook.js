import { Router } from 'express';
import stripeWebhookRoutes from './stripeWebhookRoutes.js';

const router = Router();
router.use('/stripe', stripeWebhookRoutes);
export default router;