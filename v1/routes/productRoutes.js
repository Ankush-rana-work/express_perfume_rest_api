import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import auth from "../middlewares/authMiddleware.js";
import ProductSchema from "../requestSchema/productSchema.js";

const router = Router();
router.post('/create', auth, ProductSchema.createEdit, ProductController.create);
router.get('/list', auth, ProductSchema.list, ProductController.list);
router.put('/edit/:id', auth, ProductSchema.createEdit, ProductController.edit);
router.delete('/delete/:id', auth, ProductController.delete);
router.get('/show', auth, ProductSchema.show, ProductController.show);
router.get('/attributes', ProductController.getAttributes ) 
router.get('/related-product/:productId', auth, ProductController.relatedProduct)

export default router;
