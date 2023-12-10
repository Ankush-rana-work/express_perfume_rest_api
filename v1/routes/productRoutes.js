import { Router } from 'express';
import ProductController from '../controllers/productController.js';
import auth from "../middlewares/authMiddleware.js";
import ProductSchema from "../requestSchema/productSchema.js";

const router = Router();
router.post('/create', auth, ProductSchema.createEdit, ProductController.create);
router.put('/edit/:id', auth, ProductSchema.createEdit, ProductController.edit);
router.get('/show', auth, ProductSchema.show, ProductController.show);
router.get('/attributes', ProductController.getAttributes ) 


export default router;
