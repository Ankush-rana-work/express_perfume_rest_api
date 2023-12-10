import CommonHelper from "../utils/commonHelper.js";
import constant from "../config/constant.js";

const { sendError } = CommonHelper;
const JoiHelper = {
    validate: (schema, inputs , res, next)=>{
        const { error } = schema.validate(inputs);
        if (error) {
          error.statusCode=constant.STATUS_CODE.HTTP_400_BAD_REQUEST;
          next(error);
          //sendError(res, constant.STATUS_CODE.HTTP_400_BAD_REQUEST, error.details[0].message);
        } else {
          next();
        }
    }
}

export default JoiHelper;