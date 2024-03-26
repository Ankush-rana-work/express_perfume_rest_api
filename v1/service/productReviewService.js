import db from '../../models/index.js';
import CommonHelper from '../../utils/commonHelper.js';
import CustomExceptionService from '../../customExceptionHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'
import { Sequelize } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { ProductReviewModel, MediaModel, UserModel, RoleModel, ReviewFeedbackModel, sequelize } = db;

const ProductReviewService = {
    create: async (inputs) => {
        try {
            const product = await ProductReviewModel.create({
                title: inputs.body.title,
                rating: inputs.body.rating,
                user_id: inputs.user.user_id,
                product_id: inputs.body.product_id,
            });

            if (inputs.file) {
                const type = CommonHelper.getFileType(inputs.file.mimetype);
                await MediaModel.create({
                    'name': inputs.file.path,
                    'table_id': product.id,
                    'type': type,
                    'table_name': "product_review"
                });
            }

            return product;
        } catch (error) {
            throw error;
        }
    },
    update: async (inputs, review_id) => {
        try {
            const review = await ProductReviewModel.findOne({ where: { is_deleted: 0, id: review_id } });

            if (review) {
                review.title = inputs.body.title;
                review.rating = inputs.body.rating;
                review.user_id = inputs.user.user_id,
                    review.updatedAt = new Date();

                if (await review.save()) {
                    const media = await MediaModel.findOne({ where: { table_id: review.id } });

                    if (media) {
                        const uploadPath = path.join(__dirname, '/../../', media.name);
                        fs.unlinkSync(uploadPath);
                        await media.destroy();
                    }

                    if (inputs.file) {
                        const type = CommonHelper.getFileType(inputs.file.mimetype);
                        await MediaModel.create({
                            'name': inputs.file.path,
                            'table_id': review.id,
                            'type': type,
                            'table_name': "product_review"
                        });
                    }
                }
                return review;
            }
            throw new CustomExceptionService(400, "product not exist");
        } catch (error) {
            throw error;
        }
    },
    list: async (inputs) => {
        try {
            const page = parseInt(inputs.page_no) || 1;
            const pageSize = parseInt(inputs.per_page) || 10;
            const offset = (page - 1) * pageSize;
            const { count, rows } = await ProductReviewModel.findAndCountAll({
                include: [{
                    model: UserModel,
                    as: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'is_active', 'is_delete'],
                    },
                    include: [{
                        model: RoleModel,
                        as: 'user_role',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        }
                    }]
                }, {
                    model: MediaModel,
                    as: 'review_media',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'table_id'],
                    }
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                    include: [
                        [
                          Sequelize.literal('(SELECT COUNT(*) FROM tbl_review_feedback WHERE tbl_review_feedback.review_id = productReview.id AND tbl_review_feedback.type = "helpful")'),
                          'helpfulCount',
                        ],
                        [
                            Sequelize.literal('(SELECT COUNT(*) FROM tbl_review_feedback WHERE tbl_review_feedback.review_id = productReview.id AND tbl_review_feedback.type = "likes")'),
                            'likesCount',
                        ],
                    ]
                },
                order: [
                    ['id', 'DESC']
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
    delete: async (productId) => {
        try {

            const product = await ProductReviewModel.findByPk(productId);

            if (product) {

                await product.destroy();;
            } else {
                throw new CustomExceptionService(400, "Product not found");
            }
        } catch (error) {
            throw error;
        }
    },
    createAndRemove: async (inputs, review_id) => {
        try {
            const user_id = inputs.user.user_id;
            const type = inputs.body.type;
            const action = inputs.body.action;

            const productReview = await ProductReviewModel.findByPk(review_id);

            if (!productReview) {
                throw new CustomExceptionService(400, "Product review not found");
            }

            const feedback = await ReviewFeedbackModel.findOne({
                where: {
                    review_id: review_id,
                    user_id: user_id,
                    type: type
                }
            });

            if (!action) {
                if (feedback)
                    await feedback.destroy();

                return true;
            }

            if (feedback)
                await feedback.destroy();

            await ReviewFeedbackModel.create({
                review_id: review_id,
                user_id: user_id,
                type: type
            });

            return true;
        } catch (error) {
            throw error;
        }
    },
}

export default ProductReviewService;