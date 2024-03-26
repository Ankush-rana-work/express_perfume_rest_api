import Joi from "joi";
import JoiHelper from "../../utils/joiHelper.js";

const HomeSchema = {
  newArrival: (req, res, next) => {
    const schema = Joi.object().keys({
      "per_page": Joi.number().min(1),
      "page_no": Joi.number().min(1),
    });
    JoiHelper.validate(schema, req.body, res, next);
  },
  bestSeller: (req, res, next) => {
    const schema = Joi.object().keys({
      "per_page": Joi.number().min(1),
      "page_no": Joi.number().min(1),
    });
    JoiHelper.validate(schema, req.body, res, next);
  },
  
};

export default HomeSchema;
