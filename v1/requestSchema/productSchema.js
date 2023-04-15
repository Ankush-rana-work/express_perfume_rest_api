const Joi = require("joi");
const JoiHelper = require("../../utils/joiHelper");

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
    } 
}

module.exports = ProductSchema;