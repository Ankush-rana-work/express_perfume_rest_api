const Joi = require("joi");
const JoiHelper = require("../../utils/joiHelper");

const AuthSchema = {
  register: (req, res, next) => {
    const schema = Joi.object().keys({
      firstname: Joi.string().min(3).max(40).required(),
      email: Joi.string().email().max(100).required(),
      lastname: Joi.string().max(50),
      password: Joi.string().max(100).required(),
      type: Joi.string().valid('admin', 'user').required(),
    });

    JoiHelper.validate(schema, req.body, res, next);
  },
  login:(req, res, next)=>{
    const schema= Joi.object().keys({
      email :  Joi.string().email().max(100).required(),
      password: Joi.string().max(20).required()
    });
    
    JoiHelper.validate(schema, req.body, res, next);
  },
  refreshToken: (res, req, next)=>{
    const schema = Joi.object().keys({
      refreshToken: Joi.string().required()
    });

    JoiHelper.validate(schema, req.body, res, next);
  }
};

module.exports = AuthSchema;
