import db from '../../models/index.js';
import CustomExceptionService from '../../customExceptionHandler.js';
import constant from '../../config/constant.js';

const { OrderModel } = db;
const { STATUS_CODE } = constant;

const StripeWebhookService = {
  updatedOrder: async (event, status) => {
    try {
      const paymentIntentSucceeded = event.data.object;
      const metadata = paymentIntentSucceeded.metadata;
      const orderNumber = metadata.orderNumber;

      if( !orderNumber ) {
        throw new CustomExceptionService('400', 'Order number not found')
      }

      const order = await OrderModel.findOne({ where: { order_number:orderNumber } });

      if( !orderNumber ) {
        throw new CustomExceptionService('400', 'Order not found')
      }

      if ( status == 'success') {
        order.status = "success";
      }else if( status == "fail" ){
        order.status = "failed";
      }null

      order.payment_intent_id = paymentIntentSucceeded.id || null;
      order.stripe_response = event? JSON.stringify(event):'';
      await order.save();
    } catch (error) {
      throw error;
    }
  },

};

export default StripeWebhookService;
