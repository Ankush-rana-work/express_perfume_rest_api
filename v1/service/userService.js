import db from '../../models/index.js';
import CommonHelper from '../../utils/commonHelper.js';
import JwtHelper from '../../utils/jwtHelper.js';
import CustomExceptionService from '../../customExceptionHandler.js';
import constant from '../../config/constant.js';

const { generateHash, hashCompare } = CommonHelper;
const { UserModel, RoleModel, sequelize } = db;
const { STATUS_CODE } = constant;

const UserService = {
  register: async (req) => {
    return new Promise(async function (resolve, reject) {
      let transaction;
      // using transaction to  execute atomically 
      try {
        transaction = await sequelize.transaction();
        const users = await UserModel.findOne({
          where: {
            email: req.email,
          },
        });

        // if user already exist then throw exception
        if (users) {
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Email already exist");
        }

        // if request type role is not available in database then throw exception
        const role = await RoleModel.findOne({ where: { slug: req.type } });
        if (!role) reject(new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, 'Invalid role'))

        // creating new user along with hashed password
        let user = await UserModel.create({
          firstname: req.firstname,
          email: req.email,
          lastname: req.lastname,
          password: await generateHash(req.password),
          role_id: role.id
        }, { transaction });

        // generating token
        const { token, refresh_token } = await JwtHelper.generateToken({
          user_id: user.id,
          user_firtname: user.firstname,
          user_lastname: user.lastname,
        });

        user = user ? JSON.parse(JSON.stringify(user)) : null;
        user = { ...user, token, refresh_token };
        transaction.commit();
        resolve(user);
      } catch (error) {
        transaction.rollback();
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
            exclude: ['createdAt', 'updatedAt', 'is_delete', 'password', 'role_id'],
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
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid email and password");
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
    return new Promise(async (resolve, reject) => {
      try {
        const { payload } = await JwtHelper.tokenVerify(input.refreshToken, true);

        if (!payload) {
          throw new CustomExceptionService(400, "Invalid token");
        }

        let user = await UserModel.findOne({
          where: { id: payload.user_id, is_active: 1, is_delete: 0 },
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'is_delete', 'password', 'role_id'],
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
          throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid user");
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

export default UserService;
