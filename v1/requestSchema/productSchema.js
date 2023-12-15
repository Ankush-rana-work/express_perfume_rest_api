import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const ProductSchema = {
    createEdit: (req, res, next)=>{
        const schema = Joi.object().keys({
            "title"         : Joi.string().min(3).max(255).required(),
            "subtitle"      : Joi.string().min(3).max(255).required(),
            "price"         : Joi.number().required(),
            "item_country"  : Joi.string().max(100).required(),
            "handling_time" : Joi.string().max(100).required(),
            "upc"           : Joi.string().max(100).required(),
            "manufacturer_name" : Joi.string().max(100).required(),
            "brand"         : Joi.number().required(),
            "volume"        : Joi.number().required(),
            "type"          : Joi.number().required(),
            "fragrance_name": Joi.number().required(),
            "shop_for"      : Joi.number().required()
        });
                
        JoiHelper.validate(schema, req.body, res, next);
    },
    show: (req, res, next)=>{
        const schema = Joi.object().keys({
            "per_page": Joi.number().min(1),
            "page_no": Joi.number().min(1),
            "search": Joi.string().allow('').optional()
        });
        JoiHelper.validate(schema, req.body, res, next);
    },
    attributes: (req, res, next)=>{
        const schema = Joi.object().keys({
            "per_page": Joi.number().min(1),
            "page_no": Joi.number().min(1),
        });
        
        JoiHelper.validate(schema, req.query, res, next);
    },
    list:(req, res, next)=>{
        const schema = Joi.object().keys({
            "per_page"      : Joi.number().min(1),
            "page_no"       : Joi.number().min(1),
            "brand"         : Joi.array().items(Joi.number()),
            "volume"        : Joi.array().items(Joi.number()),
            "type"          : Joi.array().items(Joi.number()),
            "fragrance_name": Joi.array().items(Joi.number()),
            "shop_for"      : Joi.array().items(Joi.number())
        });
        
        JoiHelper.validate(schema, req.query, res, next);
    },
}

export default ProductSchema;