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

const { BlogModel, MediaModel, UserModel, sequelize, CategoryModel } = db;

const CategoryService = {
  create: async (inputs) => {
    try {
      let payload = { ...inputs.body };
      payload.is_active = 0;
      payload.is_deleted = 0;

      console.log(payload.slug);
      const CategoryExist = await CategoryModel.findOne({ where: { slug: payload.slug } })

      if (CategoryExist) {
        throw new CustomExceptionService(400, "Category title already exist");
      }

      const category = await CategoryModel.create(payload);
      if (inputs.file) {
        const type = CommonHelper.getFileType(inputs.file.mimetype);
        await MediaModel.create({
          'name': inputs.file.path,
          'table_id': category.id,
          'type': type,
          'table_name': "category"
        });

      }

      return category;
    } catch (error) {
      throw error;
    }
  },
  update: async (inputs, categoryId) => {
    try {
      let categoryJson;
      let category = await CategoryModel.findOne({
        where: {
          is_deleted: 0,
          id: categoryId
        }
      });

      if (category) {
        category.name = inputs.body.name;
        if (inputs.body.is_active) {
          category.is_active = inputs.body.is_active;
        }
        category.updatedAt = new Date();

        if (category.save()) {

          // getting image image from media table
          const media = await MediaModel.findOne({ where: { table_id: category.id, table_name: 'category' } });
          if (media) {
            // generating file absolute path
            const uploadPath = __dirname + '/../../' + media.name;

            console.log(uploadPath);
            // removing file from storage
            fs.unlinkSync(uploadPath);
            //deleting previous image entry from media table
            await media.destroy();
          }
          // checking if image is selected
          if (inputs.file) {
            // moving file from tem to upload product folder
            if (inputs.file) {
              const type = CommonHelper.getFileType(inputs.file.mimetype);
              await MediaModel.create({
                'name': inputs.file.path,
                'table_id': category.id,
                'type': type,
                'table_name': "category"
              });
            }
          }

          categoryJson = { ...category.toJSON() };
          delete categoryJson.is_deleted;
          delete categoryJson.createdAt;
          delete categoryJson.updatedAt;
        }
        return categoryJson;
      }
      throw new CustomExceptionService(400, "Category not found");
    } catch (error) {
      throw error;
    }
  },
  show: async (inputs) => {
    try {
      const perPage = inputs.per_page ? inputs.per_page : constant.PER_PAGE;
      const pageNo = inputs.page_no ? inputs.page_no : constant.DEFAULT_PAGE_NO;
      const search = inputs.search ? inputs.search : '';
      let condition = {};
      condition.is_deleted = 0;
      condition.is_active = 1;

      if (search != '') {
        condition.title = { [Op.like]: `%${search}%` };
      }

      const product = await ProductModel.findAll({
        where: condition,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
          include: [
            [sequelize.literal('createdAt'), 'createdAt']
          ]
        },
        include: [{
          model: MediaModel,
          as: 'product_media', // specify the alias as 'productMedia'
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        }],
        order: [
          ['createdAt', 'DESC']
        ],
        offset: ((pageNo - 1) * perPage),
        limit: perPage
      });

      return product;
    } catch (error) {
      throw error
    }
  },
  getList: async (inputs) => {
    try {
      const page = parseInt(inputs.page_no) || 1;
      const pageSize = parseInt(inputs.per_page) || 10;
      const offset = (page - 1) * pageSize;
      const { count, rows } = await CategoryModel.findAndCountAll({
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        where: {
          is_deleted: 0
        },
        order: [
          ['id', 'DESC']
        ],
        limit: pageSize,
        offset: offset,
      });

      const totalPages = Math.ceil(count / pageSize);
      return { totalPages, count, rows };
    } catch (error) {
      throw error
    }
  },
  deleteCategory: async (blogId) => {

    try {
      // Find the blog you want to delete
      const category = await CategoryModel.findByPk(blogId);

      if (category) {
        // Delete the blog
        await category.destroy();
      } else {
        throw new CustomExceptionService(400, "Category not found");
      }
    } catch (error) {
      throw error;
    }
  },

}

export default CategoryService;