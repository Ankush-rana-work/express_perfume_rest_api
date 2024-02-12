import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const CartSchema = {
    add: (req, res, next) => {
        const schema = Joi.object().keys({
            "product_id": Joi.number().integer().required(),
            "quantity": Joi.number().integer(),
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

export default CartSchema;