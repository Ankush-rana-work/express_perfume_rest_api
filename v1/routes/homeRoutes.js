import { Router } from 'express';
import HomeSchema from '../requestSchema/homeSchema.js';
import HomeController from '../controllers/homeController.js';

const router = Router();
router.get('/new-arrival',HomeSchema.newArrival,HomeController.newArrival);
router.get('/best-seller', HomeSchema.bestSeller, HomeController.bestSeller);
router.get('/top-category', HomeController.topCategory);

export default router;