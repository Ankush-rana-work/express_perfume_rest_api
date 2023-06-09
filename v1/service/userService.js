const { UserModel, RoleModel, sequelize } = require("../../models");
const {
  sendError,
  sendSucess,
  generateHash,
  hashCompare,
} = require("../../utils/commonHelper");
const JwtHelper = require("../../utils/jwtHelper");
const bcrypt = require("bcryptjs");
const CustomExceptionService = require("../../customExceptionHandler");
const { STATUS_CODE } = require('../../config/constant');

const UserService = {
  register: async (req) => {
    return new Promise(async function (resolve, reject) {
      try {
        const users = await UserModel.findOne({
          where: {
            email: req.email,
          },
        });

        if (users) {
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Email already exist");
        }
        
        const role = await RoleModel.findOne({where:{ slug: req.type }});
        if(!role) reject(new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, 'Invalid role' ))
       
        // creating new user along with hashed password
        let user = await UserModel.create({
          firstname: req.firstname,
          email: req.email,
          lastname: req.lastname,
          password: await generateHash(req.password),
          role_id:role.id
        });

        // generating token
        const { token, refresh_token } = await JwtHelper.generateToken({
          user_id: user.id,
          user_firtname: user.firstname,
          user_lastname: user.lastname,
        });

        user = JSON.parse(JSON.stringify(user));
        user = { ...user, token, refresh_token };
        resolve(user);
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  },
  login: (input) => {
    return new Promise(async (resolve, reject) => {
      try {
        // checking user exist in our database
        let user = await UserModel.findOne({ 
          where: { email: input.email },
          attributes: { 
            exclude: ['createdAt', 'updatedAt','is_delete','password','role_id'],
            include: [
                [sequelize.literal('password'), 'password']
            ]
          },
          include: [{
              model: RoleModel,
              as: 'user_role', // specify the alias as 'productMedia'
              attributes: { 
                  exclude: ['createdAt', 'updatedAt'],
              }    
          }],
        });

        if (!user) {
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid email and password");
        }

        // comparing password with exisitng has password for user
        const isPaswordValid = await hashCompare(input.password, user.password);
        if (!isPaswordValid) {
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid email and password" );
        }

        // generating token
        const { token, refresh_token } = await JwtHelper.generateToken({
          user_id: user.id,
          user_firtname: user.firstname,
          user_lastname: user.lastname,
        });

        user = JSON.parse(JSON.stringify(user));
        user = { ...user, token, refresh_token };

        resolve(user);
      } catch (error) {
        reject(error);
      }
    });
  },
  refreshToken: (input) => {
    return new Promise( async (resolve, reject) => {
      try {
        const { payload } = await JwtHelper.tokenVerify(input.refreshToken, true);
        
        if( !payload ){
          throw new CustomExceptionService(400, "Invalid token" );
        }

        let user = await UserModel.findOne({ 
          where: { id: payload.user_id, is_active: 1, is_delete : 0 },
          attributes: { 
            exclude: ['createdAt', 'updatedAt','is_delete', 'password', 'role_id'],
            include: [
                [sequelize.literal('password'), 'password']
            ]
          },
          include: [{
              model: RoleModel,
              as: 'user_role', // specify the alias as 'productMedia'
              attributes: { 
                  exclude: ['createdAt', 'updatedAt'],
              }    
          }],
        });


        if( !user ){
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid user" );
        }

        // generating token
        const { token, refresh_token } = await JwtHelper.generateToken({
          user_id: user.id,
          user_firtname: user.firstname,
          user_lastname: user.lastname,
        });

        user = JSON.parse(JSON.stringify(user));
        user = { ...user, token, refresh_token };

        resolve(user);
      } catch (error) {
        reject(error);  
      }
    });
  },
};

module.exports = UserService;
