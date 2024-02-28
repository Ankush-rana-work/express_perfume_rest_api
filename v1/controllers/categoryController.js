import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import BlogService from '../service/blogService.js';
import CategoryService from '../service/categoryService.js';
import ProductService from '../service/productService.js';

const CategoryController = {
    /**
    * @swagger
    * tags:
    *   name: Blog
    *   description: The blog managing API
    * /v1/blog/create:
    *   post:
    *     summary: Create new blog
    *     tags: [Blog]
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *               properties:
    *                   title:
    *                       type: string
    *                       description: blog title.
    *                       example: "blog"
    *                   description:
    *                       type: string
    *                       description: Blog sub title.
    *                       example: "blog description"
    *                   content:
    *                       type: string,
    *                       description: Blog content,
    *                       example: "content"
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
            const category = await CategoryService.create(req);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_CREATE??'', null);
        }catch(error){
            next(error);
        }
    },
    /**
    * @swagger
    * tags:
    *   name: Blog
    *   description: The blog managing API
    * /v1/blog/edit/{blog_id}:
    *   put:
    *     summary: Edit Blog
    *     tags: [Blog]
    *     parameters:
    *       - in: path
    *         name: blog_id
    *         schema:
    *           type: string
    *           description: Blog id.
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
    edit: async ( req, res, next )=>{
        try{
            const categoryId = req.params.categoryId;
            const category = await CategoryService.update(req, categoryId);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_UPDATED, category);
        }catch(error){
            next(error);
        }
    },

    show: async ( req, res, next ) => {
        try{
            const product = await ProductService.show(req.body);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_LIST, product);
        }catch(error){
            next(error);
        }
    },
    /**
     * @swagger
     * tags:
     *   name: Blog
     *   description: The blog managing API
     * /v1/blog/list:
     *   get:
     *     summary: Blog list with search
     *     tags: [Blog]
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
     *       '400' :getBlogList
     *         description: invalid data
     */
    list: async(req, res, next) => {
        try{
            const getList = await CategoryService.getList(req.query);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_LIST, getList);
        }catch(error){
            next(error);
        }
    },
    /**
    * @swagger
    * tags:
    *   name: Blog
    *   description: The blog delete API
    * /v1/blog/delete/{blog_id}:
    *   delete:
    *     summary: Delete blog
    *     tags: [Blog]
    *     parameters:
    *       - in: path
    *         name: blog_id
    *         schema:
    *           type: string
    *           description: Blog id.
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
            const categoryId = req.params.categoryId;
            await CategoryService.deleteBlog(categoryId);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_DELETE, null);
        }catch(error){
            next(error);
        } 
    }
    
}

export default CategoryController;