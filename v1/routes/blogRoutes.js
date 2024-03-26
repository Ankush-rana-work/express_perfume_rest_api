import { Router } from 'express';
import BlogController from '../controllers/blogController.js';
import auth from "../middlewares/authMiddleware.js";
import { upload } from '../../config/multerImageConfig.js';
import BlogSchema from '../requestSchema/blogSchema.js';
import commebtRouter from '../routes/commentRoutes.js';

const router = Router();
router.post('/create', auth, upload.single('image'), BlogSchema.createEdit, BlogController.create);
router.put('/edit/:blogId', auth, upload.single('image'), BlogSchema.createEdit, auth, BlogController.edit);
router.get('/list', auth, BlogSchema.list, BlogController.list);
router.delete('/delete/:blogId', auth, BlogController.delete);
router.use('/comment', commebtRouter);
export default router;
