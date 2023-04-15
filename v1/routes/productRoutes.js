const router = require('express').Router();
const ProductController = require('../controllers/productController');
const auth = require('../middlewares/authMiddleware');
const ProductSchema = require('../requestSchema/productSchema');

router.post('/create', auth, ProductSchema.createEdit, ProductController.create);
router.put('/edit/:id', auth, ProductSchema.createEdit, ProductController.edit);
router.get('/show', auth, ProductSchema.show, ProductController.show); 


module.exports = router;