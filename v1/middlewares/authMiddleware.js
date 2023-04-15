const jwt = require('jsonwebtoken');
const CustomExceptionService = require("../../customExceptionHandler");
const JwtHelper = require('../../utils/jwtHelper');
const { UserModel } = require("../../models");
module.exports = async(req, res, next) => {
    try{
        if( req.headers.authorization ){
            const token     = req.headers.authorization.split(' ')[1];
            const decode    = await JwtHelper.tokenVerify(token);
            req.user        = decode.payload;
            const user_id   = req.user.user_id;
            const user      = await UserModel.findByPk(user_id);
            if( !user ){
                throw new CustomExceptionService(400, "User is not authenticated");
            }else if( user.is_active == 0){
                throw new CustomExceptionService(400, "User is not active");
            }else if( user.is_delete == 1){
                throw new CustomExceptionService(400, "User is not deleted");
            }
            next();
        }else{
            throw new CustomExceptionService(400, "Token is required");
        }
    }catch(error){
        if( error.message == "invalid signature" ){
            next(new  CustomExceptionService(400, "Invalid token") );
        }
        next(error)
    }
    
}