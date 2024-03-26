import { Router } from 'express';
import auth from "../middlewares/authMiddleware.js";
import { upload } from '../../config/multerImageConfig.js';
import ProductReviewSchema from '../requestSchema/productReviewSchema.js';
import ProductReviewController from '../controllers/productReviewController.js';
import ReviewFeedbackSchema from '../requestSchema/reviewFeedbackSchema.js';

const router = Router();
router.post('/create', auth, upload.single('image'), ProductReviewSchema.add, ProductReviewController.create);
router.put('/edit/:id', auth, upload.single('image'), ProductReviewSchema.edit, ProductReviewController.edit);
router.get('/list', auth, ProductReviewSchema.list, ProductReviewController.list);
router.delete('/delete/:id', auth, ProductReviewController.delete);
router.post('/feedback/:review_id', auth, ReviewFeedbackSchema.adddAndRemove,  ProductReviewController.createAndRemove);


export default router;
