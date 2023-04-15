const { ProductModel, MediaModel, AttributeModel, AttributeDataModel, sequelize } = require('../../models');
const { MoveFileToUploadFolder, getFileType } = require('../../utils/commonHelper');
const CustomExceptionService = require('../../customExceptionHandler');
const fs = require('fs');
const { PER_PAGE, DEFAULT_PAGE_NO } = require('../../config/constant');
const { Op } = require('sequelize');

const ProductService = {
    create: (inputs, file)=>{
        return  new Promise( async function(resolve, reject ){
            try{
                const product = await ProductModel.create(inputs);
                if ( file ) {
                    const uploaded = await MoveFileToUploadFolder(file, 'products');
                    if( uploaded.status ){
                        const type = getFileType(file.mimetype);
                        await MediaModel.create({
                                'name': uploaded.path,
                                'table_id': product.id,
                                'type': type,
                                'table_name': "product"
                            });
                    }
                }

                resolve(product);
            }catch(error){
                reject(error);
            }
        });
    },
    update: ( inputs,product_id, file ) => {
        return new Promise( async (resolve, reject)=>{
            try{
                const product = await ProductModel.findOne({ where: { is_deleted: 0 } });
                if( product ){
                    product.title           = inputs.title;
                    product.subtitle        = inputs.subtitle;
                    product.price           = inputs.price;
                    product.item_country    = inputs.item_country;
                    product.handling_time   = inputs.handling_time;
                    product.upc             = inputs.upc ;
                    product.manufacturer_name = inputs.manufacturer_name;
                    product.is_active       = 1;

                    if( product.save() ){
                        // getting image image from media table
                        const media = await MediaModel.findOne({where: { table_id: product.id}});
                        // generating file absolute path
                        const uploadPath = __dirname + '/../../' + media.name;
                        // removing file from storage
                        fs.unlinkSync(uploadPath);
                        //deleting previous image entry from media table
                        await media.destroy();
                        // checking if image is selected
                        if ( file ) {
                            // moving file from tem to upload product folder
                            const uploaded = await MoveFileToUploadFolder(file, 'products');
                            if( uploaded.status ){
                                const type = getFileType(file.mimetype);
                                await MediaModel.create({
                                        'name': uploaded.path,
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
            }catch(error){
                reject(error);
            }
        });
    },
    show: async ( inputs ) => {
        return new Promise( async (resolve, reject )=>{
            try{
                const perPage   = inputs.per_page? inputs.per_page : PER_PAGE;
                const pageNo    = inputs.page_no? inputs.page_no : DEFAULT_PAGE_NO;
                const search    = inputs.search? inputs.search : '';
                let condition   = {};
                condition.is_deleted    = 0;
                condition.is_active     = 1;

                if( search!=''){
                    condition.title     = { [Op.like]: `%${search}%` };
                }
                
                const product  = await ProductModel.findAll({
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
                        }    
                    }],
                    order: [
                        [ 'createdAt', 'DESC']
                    ],
                    offset: (( pageNo-1 ) * perPage),
                    limit:  perPage
                  });

                resolve(product)
            }catch(error){
                reject(error)
            }
        });
    },
    getAttributesList: (inputs)=>{
        return new Promise(async (resolve, reject )=>{
            try{
                const perPage   = inputs.per_page? parseInt(inputs.per_page) : parseInt(PER_PAGE);
                const pageNo    = inputs.page_no? parseInt(inputs.page_no) : parseInt(DEFAULT_PAGE_NO);
                const attribute = await AttributeModel.findOne({ where:{ slug: inputs.type }});
                
                if( !attribute ) reject(new CustomExceptionService(400,`${inputs.type} attribute is not available`));
                
                let attribute_data = await AttributeDataModel.findAndCountAll({
                    attributes: { 
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    where:{ attribute_id: attribute.id },
                    order: [
                        [ 'createdAt', 'DESC']
                    ],
                    offset: (( pageNo-1 ) * perPage),
                    limit:  perPage   
                });

                if( !attribute_data ) reject(new CustomExceptionService(400, 'Attribute data is not available '));

                const result = attribute_data.rows;
                const total_count = attribute_data.count;
                const total_page = Math.ceil(total_count / perPage);
                const current_page = pageNo;

                resolve({result, current_page, total_count, total_page});
            }catch(error){
                reject(error)
            }
        });
    }

}

module.exports= ProductService;