import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const OrderSchema = {
    checkout: (req, res, next) => {
        const schema = Joi.object().keys({
            "product_id": Joi.number().integer().required(),
            "quantity": Joi.number().integer(),
        });

        JoiHelper.validate(schema, req.body, res, next);
    },
    checkoutSession: (req, res, next ) => {
        const schema = Joi.object().keys({
            "first_name" : Joi.string().min(3).max(255).required(),
            "last_name" : Joi.string().min(3).max(255),
            "email": Joi.string().email().max(100).required(),
            "user_address":Joi.string().min(3).max(255).required(),
        });
        JoiHelper.validate(schema, req.body, res, next);
    }
}

export default OrderSchema;