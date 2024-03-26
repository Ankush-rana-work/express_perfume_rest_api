import Message from '../../local/message.js';
import CommonHelper from '../../utils/commonHelper.js';
import ProductReviewService from '../service/productReviewService.js';

const ProductReviewController = {
    create: async (req, res, next) => {
        try {
            console.log(req.body);
            await ProductReviewService.create(req);
            CommonHelper.sendSucess(res, 200, Message.REVIEW_CREATE ?? '', null);
        } catch (error) {
            next(error);
        }
    },
    edit: async (req, res, next) => {
        try {
            const product_id = req.params.id;
            const product = await ProductReviewService.update(req, product_id);
            CommonHelper.sendSucess(res, 200, Message.REVIEW_UPDATED, product);
        } catch (error) {
            next(error);
        }
    },
    list: async (req, res, next) => {
        try {
            const attribute_list = await ProductReviewService.list(req.query);
            CommonHelper.sendSucess(res, 200, Message.REVIEW_LIST, attribute_list);
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const product_id = req.params.id;
            await ProductReviewService.delete(product_id);
            CommonHelper.sendSucess(res, 200, Message.REVIEW_DELETE, null);
        } catch (error) {
            next(error);
        }
    },
    createAndRemove: async (req, res, next) => {
        try {
            const review_id = req.params.review_id;
            await ProductReviewService.createAndRemove(req, review_id);
            CommonHelper.sendSucess(res, 200, Message.REVIEW_CREATE ?? '', null);
        } catch (error) {
            next(error);
        }
    },
}

export default ProductReviewController;