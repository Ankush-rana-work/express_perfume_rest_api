import { Router } from 'express';
import auth from '../middlewares/authMiddleware.js';
import CategorySchema from '../requestSchema/categorySchema.js';
import CategoryController from '../controllers/categoryController.js';
import { categoryUpload } from '../../config/multerImageConfig.js';

const router = Router();
router.post('/create', auth, categoryUpload.single('image'), CategorySchema.create, CategoryController.create);
router.put('/edit/:categoryId', auth, categoryUpload.single('image'), CategorySchema.edit, auth, CategoryController.edit);
router.get('/list', auth, CategorySchema.list, CategoryController.list);
router.delete('/delete/:categoryId', auth, CategoryController.delete);

export default router;