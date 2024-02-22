import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import BlogService from '../service/blogService.js';
import ProductService from '../service/productService.js';

const BlogController = {
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
            const blog = await BlogService.create(req);
            CommonHelper.sendSucess(res, 200, Message.BLOG_CREATE??'', null);
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
            const blogId = req.params.blogId;
            const blog = await BlogService.update(req, blogId);
            CommonHelper.sendSucess(res, 200, Message.BLOG_UPDATED, blog);
        }catch(error){
            next(error);
        }
    },

    show: async ( req, res, next ) => {
        try{
            const product = await ProductService.show(req.body);
            CommonHelper.sendSucess(res, 200, Message.PRODUCT_LIST, product);
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
     *       '400' :
     *         description: invalid data
     */
    list: async(req, res, next) => {
        try{
            const blogList = await BlogService.getBlogList(req.query);
            CommonHelper.sendSucess(res, 200, Message.BLOG_LIST, blogList);
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
            const blogId = req.params.blogId;
            await BlogService.deleteBlog(blogId);
            CommonHelper.sendSucess(res, 200, Message.BLOG_DELETE, null);
        }catch(error){
            next(error);
        } 
    }
    
}

export default BlogController;