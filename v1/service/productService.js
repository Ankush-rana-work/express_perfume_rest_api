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

const { ProductModel, MediaModel, AttributeModel, AttributeDataModel, sequelize } = db;

const ProductService = {
    create: async (inputs) => {
        try {
            const product = await ProductModel.create(inputs.body);

            if (inputs.file) {
                const type = CommonHelper.getFileType(inputs.file.mimetype);
                await MediaModel.create({
                    'name': inputs.file.path,
                    'table_id': product.id,
                    'type': type,
                    'table_name': "product"
                });
            }

            return product;
        } catch (error) {
            throw error;
        }
    },

    update: async (inputs, product_id) => {
        try {
            const product = await ProductModel.findOne({ where: { is_deleted: 0, id: product_id } });

            if (product) {
                product.title = inputs.body.title;
                product.subtitle = inputs.body.subtitle;
                product.price = inputs.body.price;
                product.item_country = inputs.body.item_country;
                product.handling_time = inputs.body.handling_time;
                product.upc = inputs.body.upc;
                product.manufacturer_name = inputs.body.manufacturer_name;
                product.is_active = 1;
                product.updatedAt = new Date();

                if (await product.save()) {
                    const media = await MediaModel.findOne({ where: { table_id: product.id } });

                    if (media) {
                        const uploadPath = path.join(__dirname, '/../../', media.name);
                        fs.unlinkSync(uploadPath);
                        await media.destroy();
                    }

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

                return product;
            }

            throw new CustomExceptionService(400, "Email already exists");
        } catch (error) {
            throw error;
        }
    },
    show: async (inputs) => {
        try {
            const perPage = inputs.per_page || constant.PER_PAGE;
            const pageNo = inputs.page_no || constant.DEFAULT_PAGE_NO;
            const search = inputs.search || '';

            const condition = {
                is_deleted: 0,
                is_active: 1
            };

            if (search !== '') {
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
                    as: 'product_media',
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
            throw error;
        }
    },
    getProductList: async (inputs) => {
        try {
            const page = parseInt(inputs.page_no) || 1;
            const pageSize = parseInt(inputs.per_page) || 10;
            const offset = (page - 1) * pageSize;
            const { count, rows } = await ProductModel.findAndCountAll({
                include: [{
                    model: AttributeDataModel,
                    as: 'attr_brand',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                    },
                    include: {
                        model: AttributeModel,
                        as: 'attr_name',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                        },
                    }
                }, {
                    model: AttributeDataModel,
                    as: 'attr_volume',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                    },
                    include: {
                        model: AttributeModel,
                        as: 'attr_name',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                        },
                    }
                },
                {
                    model: AttributeDataModel,
                    as: 'attr_shop_for',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                    },
                    include: {
                        model: AttributeModel,
                        as: 'attr_name',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                        },
                    }
                },
                {
                    model: AttributeDataModel,
                    as: 'attr_fragrancename',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                    },
                    include: {
                        model: AttributeModel,
                        as: 'attr_name',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'attribute_id'],
                        },
                    }
                }, {
                    model: MediaModel,
                    as: 'product_media', // specify the alias as 'productMedia'
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'table_id'],
                    }
                }],
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
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
    getAttributesList: () => {
        try {
            const attributeData = AttributeModel.findAll({
                include: {
                    model: AttributeDataModel,
                    as: 'attribute_data',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'attribute_id']
                    }
                }
            })

            return attributeData;
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: async (productId) => {
        try {
            // Find the product you want to delete
            const product = await ProductModel.findByPk(productId);

            if (product) {
                // Delete the product
                await product.destroy();;
            } else {
                throw new CustomExceptionService(400, "Product not found");
            }
        } catch (error) {
            throw error;
        }
    },
    relatedProduct: async (productId) => {
        try {
            // Find the product you want to delete
            const product = await ProductModel.findByPk(productId);
            console.log(product.brand);
            if (product) {
                // Find the product you want to delete
                const realtedProduct = await ProductModel.findAll({
                    where: {
                        brand: product.brand,
                        id: {
                            [Op.not]: product.id // Define the condition where 'someField' is NOT equal to 'someValue'
                        }
                    },
                    order: [
                        ['updatedAt', 'DESC'] // Order by 'updatedAt' column in descending order
                    ],
                    limit: 20 // Limit the result to 20 records
                });
                return realtedProduct;
            } else {
                throw new CustomExceptionService(400, "Product not found");
            }

        } catch (error) {
            throw error;
        }
    }

}

export default ProductService;