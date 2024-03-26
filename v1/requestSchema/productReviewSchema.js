import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const ProductReviewSchema = {
    add: (req, res, next)=>{
        const schema = Joi.object().keys({
            "title"         : Joi.string().min(3).max(255).required(),
            "rating"        : Joi.number().required(),
            "product_id"    : Joi.number().required()
        });
                
        JoiHelper.validate(schema, req.body, res, next);
    },
    edit: (req, res, next)=>{
        const schema = Joi.object().keys({
            "title"         : Joi.string().min(3).max(255).required(),
            "rating"        : Joi.number().required(),
            "product_id"    : Joi.number().required()
        });
                
        JoiHelper.validate(schema, req.body, res, next);
    },
    list: (req, res, next)=>{
        const schema = Joi.object().keys({
            "per_page": Joi.number().min(1),
            "page_no": Joi.number().min(1),
        });
                
        JoiHelper.validate(schema, req.body, res, next);
    }
}

export default ProductReviewSchema;