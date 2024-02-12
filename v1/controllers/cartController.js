import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import CartService from '../service/cartService.js';

const CartController = {
    add: async ( req, res, next )=>{
        try{
            console.log(req.body);
            const cart = await CartService.create(req);
            CommonHelper.sendSucess(res, 200, Message.CART_ADD??'', cart);
        }catch(error){
            next(error);
        }
    },
    update: async ( req, res, next )=>{
        try{
            const cartId = req.params.cartId;
            const cart = await CartService.update(req, cartId);
            CommonHelper.sendSucess(res, 200, Message.CART_UPDATED, cart);
        }catch(error){
            next(error);
        }
    },
    list: async(req, res, next) => {
        try{
            const cartList = await CartService.getCartList(req.query);
            CommonHelper.sendSucess(res, 200, Message.CART_LIST, cartList);
        }catch(error){
            next(error);
        }
    },
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