const { UserModel,sequelize } = require("../../models");
const {
  sendError,
  sendSucess,
  generateHash,
  hashCompare,
} = require("../../utils/commonHelper");
const JwtHelper = require("../../utils/jwtHelper");
const bcrypt = require("bcryptjs");
const CustomExceptionService = require("../../customExceptionHandler");

const UserService = {
  register: async (req) => {
    return new Promise(async function (resolve, reject) {
      try {
        const users = await UserModel.findOne({
          where: {
            email: req.body.email,
          },
        });

        if (users) {
          throw new CustomExceptionService(400, "Email already exist");
        }

        // creating new user along with hashed password
        let user = await UserModel.create({
          firstname: req.body.firstname,
          email: req.body.email,
          lastname: req.body.lastname,
          password: await generateHash(req.body.password),
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
        });
        if (!user) {
          throw new CustomExceptionService(400, "User is not exist");
        }

        // comparing password with exisitng has password for user
        const isPaswordValid = await hashCompare(input.password, user.password);
        if (!isPaswordValid) {
          throw new CustomExceptionService(400, "Invalid username and password" );
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

        let user = await UserModel.findOne({ where: { id: payload.user_id, is_active: 1, is_delete : 0 } });

        if( !user ){
          throw new CustomExceptionService(400, "Invalid user" );
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
