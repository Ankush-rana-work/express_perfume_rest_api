import db from '../../models/index.js';
import CommonHelper from '../../utils/commonHelper.js';
import JwtHelper from '../../utils/jwtHelper.js';
import CustomExceptionService from '../../customExceptionHandler.js';
import constant from '../../config/constant.js';

const { generateHash, hashCompare } = CommonHelper;
const { ProductModel, MediaModel, CategoryModel, UserModel, sequelize } = db;
const { STATUS_CODE } = constant;

const HomeService = {
  newArrival: async (inputs) => {
    try {
      const page = parseInt(inputs.page_no) || 1;
      const pageSize = parseInt(inputs.per_page) || 10;
      const offset = (page - 1) * pageSize;
      const { count, rows } = await ProductModel.findAndCountAll({
        include: [
          {
            model: CategoryModel,
            as: 'category', // specify the alias as 'productMedia'
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'is_active', 'is_deleted'],
            }
          },
          {
            model: MediaModel,
            as: 'product_media', // specify the alias as 'productMedia'
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'table_id'],
            }
          }],
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          is_deleted: 0,
          new_arrival: true
        },
        order: [
          ['id', 'DESC'] // Order by 'updatedAt' column in descending order
        ],
        limit: pageSize,
        offset: offset,
      });

      const totalPages = Math.ceil(count / pageSize);
      return ({ totalPages, count, rows });
    } catch (error) {
      throw error;
    }
  },
  bestSeller: async (input) => {
  },
  topCategory: async (inputs) => {
    try {
      const page = parseInt(inputs.page_no) || 1;
      const pageSize = parseInt(inputs.per_page) || 10;
      const offset = (page - 1) * pageSize;

      const { count, rows } = await CategoryModel.findAndCountAll({
        include: [{
          model: MediaModel,
          as: 'category_media',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'table_id'],
          }
        }],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'is_active', 'is_deleted'],
        },
        where: {
          is_deleted: 0
        },
        order: [
          ['name', 'ASC']
        ],
        limit: pageSize,
        offset: offset,
      });
      const totalPages = Math.ceil(count / pageSize);
      return { totalPages, count, rows };
    } catch (error) {
      throw error;
    }
  }
};

export default HomeService;
