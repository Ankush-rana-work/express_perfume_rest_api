import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import ProductService from '../service/productService.js';

const ProductController = {
    /**
    * @swagger
    * tags:
    *   name: Product
    *   description: The product managing API
    * /v1/product/create:
    *   post:
    *     summary: Create new product
    *     tags: [Product]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *               properties:
    *                   title:
    *                       type: string
    *                       description: product titel.
    *                       example: "product"
    *                   subtitle:
    *                       type: string
    *                       description: Product sub title.
    *                       example: "product subtitle"
    *                   price:
    *                       type: string,
    *                       description: Product price,
    *                       example: 12.44
    *                   item_country:
    *                       type: string
    *                       description: Product country.
    *                       example: "ankush"
    *                   handling_time:
    *                       type: string
    *                       description: Product handling time.
    *                       example: "1-2 business days"
    *                   upc:
    *                       type: string,
    *                       description: product upc,
    *                       example: "hoobio12345"
    *                   manufacturer_name:
    *                       type: string,
    *                       description: Product manufacturer name,
    *                       example: "abc"
    *     responses:
    *       '200' :
    *         description: success
    *       '500' :
    *         description: internal server error
    *       '400' :
    *         description: invalid data
    *
    */
    create: async ( req, res, next )=>{
        try{
            console.log(req.body);
            const product = await ProductService.create(req);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_CREATE??'', null);
        }catch(error){
            next(error);
        }
    },
    /**
    * @swagger
    * tags:
    *   name: Product
    *   description: The product managing API
    * /v1/product/edit/{id}:
    *   put:
    *     summary: Edit product
    *     tags: [Product]
    *     parameters:
    *       - in: query
    *         name: id
    *         schema:
    *           type: string
    *           description: Product id.
    *           example: 1
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *               properties:

    *                   title:
    *                       type: string
    *                       description: product titel.
    *                       example: "product"
    *                   subtitle:
    *                       type: string
    *                       description: Product sub title.
    *                       example: "product subtitle"
    *                   price:
    *                       type: string,
    *                       description: Product price,
    *                       example: 12.44
    *                   item_country:
    *                       type: string
    *                       description: Product country.
    *                       example: "ankush"
    *                   handling_time:
    *                       type: string
    *                       description: Product handling time.
    *                       example: "1-2 business days"
    *                   upc:
    *                       type: string,
    *                       description: product upc,
    *                       example: "hoobio12345"
    *                   manufacturer_name:
    *                       type: string,
    *                       description: Product manufacturer name,
    *                       example: "abc"
    *     responses:
    *       '200' :
    *         description: success
    *       '500' :
    *         description: internal server error
    *       '400' :
    *         description: invalid data
    *
    */
    edit: async ( req, res, next )=>{
        try{
            const product_id = req.params.id;
            const product = await ProductService.update(req, product_id);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_UPDATED, product);
        }catch(error){
            next(error);
        }
    },
    /**
     * @swagger
     * tags:
     *   name: Product
     *   description: The product managing API
     * /v1/product/show:
     *   get:
     *     summary: Product list with search
     *     tags: [Product]
     *     parameters:
     *       - in: query
     *         name: per_page
     *         schema:
     *           type: integer
     *           description: Per page number.
     *           example: 10
     *       - in: query
     *         name: page_no
     *         schema:
     *           type: integer
     *           description: Page number.
     *           example: 1
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *           description: search.
     *           example: ""
     *     responses:
     *       '200' :
     *         description: success
     *       '500' :
     *         description: internal server error
     *       '400' :
     *         description: invalid data
     */
    show: async ( req, res, next ) => {
        try{
            const product = await ProductService.show(req.body);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_LIST, product);
        }catch(error){
            next(error);
        }
    },
      /**
     * @swagger
     * tags:
     *   name: Product
     *   description: The product managing API
     * /v1/product/attributes:
     *   get:
     *     summary: Product attributes list
     *     tags: [Product]
     *     parameters:
     *       - in: query
     *         name: per_page
     *         schema:
     *           type: integer
     *           description: Per page number.
     *           example: 10
     *       - in: query
     *         name: page_no
     *         schema:
     *           type: integer
     *           description: Page number.
     *           example: 1
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           description: attributes type.
     *           enum: [brand, volume, shop_for, formulation]
     *           example: ""
     *     responses:
     *       '200' :
     *         description: success
     *       '500' :
     *         description: internal server error
     *       '400' :
     *         description: invalid data
     */
    getAttributes: async (req, res, next)=>{
        try{
            const attribute_list = await ProductService.getAttributesList(req.query);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_LIST, attribute_list);
        }catch(error){
            next(error);
        }
    },
          /**
     * @swagger
     * tags:
     *   name: Product
     *   description: The product managing API
     * /v1/product/list:
     *   get:
     *     summary: Product listing
     *     tags: [Product]
     *     parameters:
     *       - in: query
     *         name: per_page
     *         schema:
     *           type: integer
     *           description: Per page number.
     *           example: 10
     *       - in: query
     *         name: page_no
     *         schema:
     *           type: integer
     *           description: Page number.
     *           example: 1
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *           description: attributes type.
     *           enum: [brand, volume, shop_for, formulation]
     *           example: ""
     *     responses:
     *       '200' :
     *         description: success
     *       '500' :
     *         description: internal server error
     *       '400' :
     *         description: invalid data
     */
    list: async(req, res, next) => {
        try{
            const attribute_list = await ProductService.getProductList(req.query);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_LIST, attribute_list);
        }catch(error){
            next(error);
        }
    },
    delete: async(req, res, next) => {
        try{
            const product_id = req.params.id;
            await ProductService.deleteProduct(product_id);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_DELETE, null);
        }catch(error){
            next(error);
        } 
    },
    relatedProduct: async(req, res, next) => {
        try{
            const product_id = req.params.productId;
            const productList = await ProductService.relatedProduct(product_id);
            CommonHelper.sendSucess(res, 200, Message.RELATED_PRODUCT_LIST, productList);
        }catch(error){
            next(error);
        }
    }
    
}

export default ProductController;