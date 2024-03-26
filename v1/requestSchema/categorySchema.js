import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const CategorySchema = {
    create: (req, res, next) => {
        const schema = Joi.object().keys({
            "name": Joi.string().min(3).max(255).required(),
            "slug": Joi.string().min(3).max(255).required(),
        });

        JoiHelper.validate(schema, req.body, res, next);
    },
    edit: (req, res, next) => {
        const schema = Joi.object().keys({
            "name": Joi.string().min(3).max(255).required(),
            "is_active":Joi.number()
        });

        JoiHelper.validate(schema, req.body, res, next);
    },
    list: (req, res, next) => {
        const schema = Joi.object().keys({
            "per_page": Joi.number().min(1),
            "page_no": Joi.number().min(1),
        });

        JoiHelper.validate(schema, req.query, res, next);
    },
}

export default CategorySchema;