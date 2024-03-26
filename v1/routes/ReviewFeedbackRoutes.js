import { Router } from 'express';
import auth from "../middlewares/authMiddleware.js";
import { upload } from '../../config/multerImageConfig.js';
import ReviewFeedbackSchema from '../requestSchema/reviewFeedbackSchema.js';
import ReviewFeedbackController from '../controllers/reviewFeedbackController.js';

const router = Router();
router.post('/create', auth, upload.single('image'), ReviewFeedbackSchema.add, ReviewFeedbackController.create);

export default router;
