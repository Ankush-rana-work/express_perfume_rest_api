import db from '../../models/index.js';
import Stripe from 'stripe';
import config from '../../config/index.js';
import CustomExceptionService from '../../customExceptionHandler.js';
import { v4 as uuidv4 } from 'uuid';
import CommonHelper from '../../utils/commonHelper.js';

const { STRIPE } = config;
const stripeInstance = Stripe(STRIPE.SECRETE_KEY);
const { CartModel, UserModel, ProductModel, AttributeDataModel, MediaModel, OrderModel, OrderItemModel, sequelize } = db;

const OrderService = {
  checkoutSession: (inputs) => {
    return new Promise(async function (resolve, reject) {
      const t = await sequelize.transaction();
      try {

        let productData = [];
        const  payload = { ...inputs.body };
        const userId = inputs.user.user_id;
        const uniqueId = uuidv4();
        const orderNumber = `#ORD-${uniqueId.substr(0, 10)}`;
        const cart = await OrderService.getCartInfo(userId);

        if (!cart) {
          reject(new CustomExceptionService(400, "No item found in cart"));
        }

        // Calculate the total amount by summing up the prices of each item in the car.
        const totalAmount = cart.reduce((total, item) => total + parseFloat(item?.product?.price * item.quantity) || 0, 0);
        //save order
        const order = await OrderModel.create({
          user_id: userId,
          order_number: orderNumber,
          first_name: payload.first_name,
          last_name: payload.last_name || null,
          email: payload.email || null,
          user_address: payload.user_address,
          total_price: totalAmount,
        }, { transaction: t });

        // saving order items 
        cart.forEach(async (item) => {
          await OrderItemModel.create({
            order_id: order.id,
            product_id: item.product.id,
            product_qty: item.quantity,
            product_price: item.product.price,
            product_total_price: (item.quantity * item.product.price),
            is_deleted: 0,
          }, { transaction: t });
        });

        cart.forEach(item => {
          productData.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item?.product?.title,
                description: item?.product?.subtitle,
                images: item?.product?.product_media[0]?.name ? [process.env.BASE_URL + item?.product?.product_media[0]?.name] : [],
              },
              unit_amount: (item.product.price) * 100, // Convert to cents
            },
            quantity: item.quantity,
          });
        });


        const session = await stripeInstance.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: productData,
          mode: 'payment',
          payment_intent_data:{
            metadata:{
              orderNumber: orderNumber
            },
          },
          success_url: STRIPE.SUCCCESS_REDIRECT_URL, // Redirect URL after successful payment
          cancel_url: STRIPE.CANCEL_REDIRECT_URL,   // Redirect URL after canceled payment
        });

        if (session) {
          await t.commit()
        }

        resolve(session);
      } catch (error) {
        await t.rollback();
        reject(error);
      }
    });
  },
  getCartInfo: async (userId) => {
    try {
      let cart = await CartModel.findAll({
        where: { user_id: userId },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [{
          model: UserModel,
          as: 'user',
          attributes: ['id', 'firstname', 'email', 'lastname'],
        }, {
          model: ProductModel,
          as: 'product',
          attributes: ['id', 'title', 'subtitle', 'price', 'handling_time', 'manufacturer_name', 'quantity', 'brand', 'volume', 'shop_for', 'fragrance_name', 'quantity', 'type'],
          include: [{
            model: AttributeDataModel,
            as: 'attr_brand',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: AttributeDataModel,
            as: 'attr_volume',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: AttributeDataModel,
            as: 'attr_shop_for',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: AttributeDataModel,
            as: 'attr_fragrancename',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: AttributeDataModel,
            as: 'attr_type',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }, {
            model: MediaModel,
            as: 'product_media',
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }]
        }],
      });
      return cart;
    } catch (error) {
      throw error;
    }
  }
}

export default OrderService;