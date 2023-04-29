const { sendError } = require("../utils/commonHelper");
const Constant  = require("../config/constant");

const JoiHelper = {
    validate: (schema, inputs , res, next)=>{
        const { error } = schema.validate(inputs);
        if (error) {
          error.statusCode=Constant.STATUS_CODE.HTTP_400_BAD_REQUEST;
          next(error);
          //sendError(res, Constant.STATUS_CODE.HTTP_400_BAD_REQUEST, error.details[0].message);
        } else {
          next();
        }
    }
}

module.exports = JoiHelper;