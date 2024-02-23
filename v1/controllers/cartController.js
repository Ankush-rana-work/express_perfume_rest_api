import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import CartService from '../service/cartService.js';

const CartController = {
        /**
    * @swagger
    * tags:
    *   name: Cart
    *   description: The cart managing API
    * /v1/cart/add:
    *   post:
    *     summary: Add to cart
    *     tags: [Cart]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *               properties:
    *                   product_id:
    *                       type: string
    *                       description: blog title.
    *                       example: "62"
    *                   quantity:
    *                       type: string
    *                       description: Blog sub title.
    *                       example: "3"
    *     responses:
    *       '200' :
    *         description: success
    *       '500' :
    *         description: internal server error
    *       '400' :
    *         description: invalid data
    *
    */
    add: async ( req, res, next )=>{
        try{
            console.log(req.body);
            const cart = await CartService.create(req);
            CommonHelper.sendSucess(res, 200, Message.CART_ADD??'', cart);
        }catch(error){
            next(error);
        }
    },
        /**
    * @swagger
    * tags:
    *   name: Cart
    *   description: The Cart managing API
    * /v1/cart/update/{cart_id}:
    *   put:
    *     summary: Edit Cart
    *     tags: [Cart]
    *     parameters:
    *       - in: path
    *         name: cart_id
    *         schema:
    *           type: string
    *           description: Cart id.
    *           example: 1
    *     responses:
    *       '200' :
    *         description: success
    *       '500' :
    *         description: internal server error
    *       '400' :
    *         description: invalid data
    *
    */
    update: async ( req, res, next )=>{
        try{
            const cartId = req.params.cartId;
            const cart = await CartService.update(req, cartId);
            CommonHelper.sendSucess(res, 200, Message.CART_UPDATED, cart);
        }catch(error){
            next(error);
        }
    },
        /**
     * @swagger
     * tags:
     *   name: Blog
     *   description: The cart managing API
     * /v1/cart/list:
     *   get:
     *     summary: Cart list with search
     *     tags: [Cart]
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
            const cartList = await CartService.getCartList(req.query);
            CommonHelper.sendSucess(res, 200, Message.CART_LIST, cartList);
        }catch(error){
            next(error);
        }
    },
    /**
    * @swagger
    * tags:
    *   name: Cart
    *   description: The cart delete API
    * /v1/blog/delete/{cart_id}:
    *   delete:
    *     summary: Delete cart
    *     tags: [Cart]
    *     parameters:
    *       - in: path
    *         name: blog_id
    *         schema:
    *           type: string
    *           description: Cart id.
    *           example: 1
    *     responses:
    *       '200' :
    *         description: success
    *       '500' :
    *         description: internal server error
    *       '400' :
    *         description: invalid data
    *
    */
    delete: async(req, res, next) => {
        try{
            const cartId = req.params.cartId;
            await CartService.deleteCart(cartId);
            CommonHelper.sendSucess(res, 200, Message.CART_DELETE, null);
        }catch(error){
            next(error);
        } 
    }
    
}

export default CartController;