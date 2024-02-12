import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import OrderService from '../service/orderService.js';

const OrderController = {
    cartDetail: async (req, res, next) => {
        try {
            // Initialize an object to store car details.
            const carDetail = {};
            const userId = req.user.user_id;
            // Fetch car details using the OrderService, default to an empty array if not available.
            carDetail.items = await OrderService.getCartInfo(userId) || [];
            // Calculate the total amount by summing up the prices of each item in the car.
            carDetail.totalAmount = carDetail.items.reduce((total, item) => total + parseFloat(item?.product?.price * item.quantity) || 0, 0);
            // Send a success response with HTTP status 200, a success message, and the car details.
            CommonHelper.sendSucess(res, 200, Message.CART_ADD ?? '', carDetail);
        } catch (error) {
            next(error);
        }
    },
    checkoutSession: async (req, res, next) => {
        try {
            const checkout = await OrderService.checkoutSession(req);
            res.json({checkout});
        } catch (error) {
            next(error);
        }
    }
}

export default OrderController;