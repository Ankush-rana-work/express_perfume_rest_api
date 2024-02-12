import db from '../../models/index.js';
import CommonHelper from '../../utils/commonHelper.js';
import CustomExceptionService from '../../customExceptionHandler.js';
import constant from '../../config/constant.js';
import { Op } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { UserModel, CartModel, ProductModel } = db;

const CartService = {
  create: (inputs) => {
    return new Promise(async function (resolve, reject) {
      try {
        let cartJson;
        const userId = inputs.user.user_id;
        let product = await ProductModel.findByPk(inputs.body.product_id);
        console.log(product,'product');
        if (!product) {
          reject(new new CustomExceptionService(400, "Product not found "));
        }

        let cart = await CartModel.findOne({
          where: {
            product_id: inputs.body.product_id,
            user_id: userId,
          }
        });

        if (!cart) {
          cart = await CartModel.create({
            user_id: userId,
            product_id: inputs.body.product_id,
            quantity: inputs.body.quantity ?? 1
          });
        } else {
          const updatedQuantity = !inputs.body.quantity ? cart.quantity + 1 : inputs.body.quantity;
          cart.quantity = updatedQuantity
          cart.save();
        }

        cartJson = { ...cart.toJSON() };
        delete cartJson.is_deleted;
        delete cartJson.createdAt;
        delete cartJson.updatedAt;

        resolve(cartJson);
      } catch (error) {
        reject(error);
      }
    });
  },
  update: (inputs, cartId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cartJson;
        let cart = await CartModel.findByPk(cartId);

        if (!cart) {
          reject(new CustomExceptionService(400, 'selecte product not found in cart'));
        }

        cart.quantity = inputs.body.quantity;
        cart.save();

        cartJson = { ...cart.toJSON() };
        delete cartJson.is_deleted;
        delete cartJson.createdAt;
        delete cartJson.updatedAt;


        resolve(cartJson);
      } catch (error) {
        reject(error);
      }
    });
  },
  getCartList: (inputs) => {
    return new Promise(async (resolve, reject) => {
      try {
        const page = parseInt(inputs.page_no) || 1;
        const pageSize = parseInt(inputs.per_page) || 10;
        const offset = (page - 1) * pageSize;
        const { count, rows } = await CartModel.findAndCountAll({
          include: [{
            model: UserModel,
            as: 'user',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password', 'is_delete'],
            },
            where: {
              is_active: 1
            }
          }, {
            model: ProductModel,
            as: 'product',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'password', 'is_delete'],
            },
          }],
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          limit: pageSize,
          offset: offset,
        });

        const totalPages = Math.ceil(count / pageSize);
        resolve({ totalPages, count, rows });
      } catch (error) {
        reject(error)
      }
    });
  },
  deleteCart: (cartId) => {
    return new Promise(async (resolve, reject) => {
      try {

        // Find the blog you want to delete
        const cart = await CartModel.findByPk(cartId);

        if (cart) {
          // Delete the blog
          await cart.destroy();
          resolve();
        } else {
          reject(new CustomExceptionService(400, "cart not found"));
        }
      } catch (error) {
        reject(error);
      }
    });
  },

}

export default CartService;