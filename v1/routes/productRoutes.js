import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import auth from "../middlewares/authMiddleware.js";
import ProductSchema from "../requestSchema/productSchema.js";
import { upload } from '../../config/multerImageConfig.js';

const router = Router();
router.post('/create', auth, upload.single('image'), ProductSchema.createEdit, ProductController.create);
router.put('/edit/:id', auth, upload.single('image'), ProductSchema.createEdit, auth, ProductController.edit);
router.get('/list', auth, ProductSchema.list, ProductController.list);
router.delete('/delete/:id', auth, ProductController.delete);
router.get('/show', auth, ProductSchema.show, ProductController.show);
router.get('/attributes', ProductController.getAttributes)
router.get('/related-product/:productId', auth, ProductController.relatedProduct)

export default router;
