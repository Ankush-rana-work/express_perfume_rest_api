import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const ReviewFeedbackSchema = {
    adddAndRemove: (req, res, next)=>{
        const schema = Joi.object().keys({
            "action" : Joi.boolean().required(),
            "type" : Joi.string().valid('likes', 'helpful').required()
        });
                
        JoiHelper.validate(schema, req.body, res, next);
    }
}

export default ReviewFeedbackSchema;