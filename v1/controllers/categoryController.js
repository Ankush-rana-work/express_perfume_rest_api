import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import BlogService from '../service/blogService.js';
import CategoryService from '../service/categoryService.js';
import ProductService from '../service/productService.js';

const CategoryController = {
    create: async ( req, res, next )=>{
        try{
            console.log(req.body);
            const category = await CategoryService.create(req);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_CREATE??'', null);
        }catch(error){
            next(error);
        }
    },
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
    list: async(req, res, next) => {
        try{
            const getList = await CategoryService.getList(req.query);
            CommonHelper.sendSucess(res, 200, Message.CATEGORY_LIST, getList);
        }catch(error){
            next(error);
        }
    },
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