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

const { BlogModel, MediaModel, UserModel, sequelize } = db;

const BlogService = {
  create: async (inputs) => {
    try {
      let payload = { ...inputs.body };
      payload.slug = inputs.body.title;
      payload.user_id = inputs.user.user_id;
      payload.is_active = 0;
      payload.is_deleted = 0;

      const blogExist = await BlogModel.findOne({ where: { slug: payload.slug } })

      if (blogExist) {
        throw new CustomExceptionService(400, "Blog title already exist");
      }

      const product = await BlogModel.create(payload);
      if (inputs.file) {
        const type = CommonHelper.getFileType(inputs.file.mimetype);
        await MediaModel.create({
          'name': inputs.file.path,
          'table_id': product.id,
          'type': type,
          'table_name': "blog"
        });

      }

      return product;
    } catch (error) {
      throw error;
    }
  },
  update: async (inputs, blogId) => {
    try {
      let blogJson;
      let blog = await BlogModel.findOne({
        include: [{
          model: UserModel,
          required: false,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'is_delete'],
          },
          where: {
            is_active: 1
          }
        }],
        where: {
          is_deleted: 0,
          id: blogId
        }
      });

      if (blog) {
        blog.title = inputs.body.title;
        blog.slug = inputs.body.title;
        blog.description = inputs.body.description;
        blog.content = inputs.body.content;
        blog.updatedAt = new Date();

        if (blog.save()) {

          // getting image image from media table
          const media = await MediaModel.findOne({ where: { table_id: blog.id, table_name: 'blog' } });
          if (media) {
            // generating file absolute path
            const uploadPath = __dirname + '/../../' + media.name;
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
                'table_id': product.id,
                'type': type,
                'table_name': "product"
              });
            }
          }

          blogJson = { ...blog.toJSON() };
          delete blogJson.is_deleted;
          delete blogJson.createdAt;
          delete blogJson.updatedAt;
        }
        return blogJson;
      }
      throw new CustomExceptionService(400, "Blog not found");
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
  getBlogList: async (inputs) => {
    try {
      const page = parseInt(inputs.page_no) || 1;
      const pageSize = parseInt(inputs.per_page) || 10;
      const offset = (page - 1) * pageSize;
      const { count, rows } = await BlogModel.findAndCountAll({
        include: [{
          model: UserModel,
          required: false,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'is_delete'],
          },
          where: {
            is_active: 1
          }
        }],
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
  deleteBlog: async (blogId) => {

    try {
      // Find the blog you want to delete
      const blog = await BlogModel.findByPk(blogId);

      if (blog) {
        // Delete the blog
        await blog.destroy();
      } else {
        throw new CustomExceptionService(400, "Blog not found");
      }
    } catch (error) {
      throw error;
    }
  },

}

export default BlogService;