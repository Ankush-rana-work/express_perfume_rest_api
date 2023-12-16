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
    create: (inputs) => {
        return new Promise(async function (resolve, reject) {
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

                resolve(product);
            } catch (error) {
                reject(error);
            }
        });
    },
    update: (inputs, product_id) => {
        return new Promise(async (resolve, reject) => {
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

                    if (product.save()) {

                        // getting image image from media table
                        const media = await MediaModel.findOne({ where: { table_id: product.id } });
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
                    }
                    resolve(product);
                }
                reject(new new CustomExceptionService(400, "Email already exist"));
            } catch (error) {
                reject(error);
            }
        });
    },
    show: async (inputs) => {
        return new Promise(async (resolve, reject) => {
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

                resolve(product)
            } catch (error) {
                reject(error)
            }
        });
    },
    getProductList: (inputs) => {
        return new Promise(async (resolve, reject) => {
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
    getAttributesList: () => {
        return new Promise(async (resolve, reject) => {
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

                resolve(attributeData);
            } catch (error) {
                reject(error);
            }
        });
    },
    deleteProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            try {

                // Find the product you want to delete
                const product = await ProductModel.findByPk(productId);

                if (product) {
                    // Delete the product
                    await product.destroy();
                    resolve();
                } else {
                    reject(new CustomExceptionService(400, "Product not found"));
                }
            } catch (error) {
                reject(error);
            }
        });
    },
    relatedProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
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
                    resolve(realtedProduct);
                } else {
                    reject(new CustomExceptionService(400, "Product not found"));
                }

            } catch (error) {
                reject(error);
            }
        });
    }

}

export default ProductService;