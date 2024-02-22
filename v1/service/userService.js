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
    // Using transaction to execute atomically
    let transaction;

    try {
      transaction = await sequelize.transaction();

      // Check if the user already exists
      const existingUser = await UserModel.findOne({
        where: {
          email: req.email,
        },
      });

      if (existingUser) {
        throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Email already exists");
      }

      // Check if the requested role is available in the database
      const role = await RoleModel.findOne({ where: { slug: req.type } });
      if (!role) {
        throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, 'Invalid role');
      }

      // Create a new user with a hashed password
      const user = await UserModel.create({
        firstname: req.firstname,
        email: req.email,
        lastname: req.lastname,
        password: await generateHash(req.password),
        role_id: role.id
      }, { transaction });

      // Generate tokens
      const { token, refresh_token } = await JwtHelper.generateToken({
        user_id: user.id,
        user_firstname: user.firstname,
        user_lastname: user.lastname,
      });

      // Enhance the user object with tokens
      const userWithTokenInfo = {
        ...user.toJSON(),
        token,
        refresh_token
      };

      // Commit the transaction
      await transaction.commit();

      return userWithTokenInfo;
    } catch (error) {
      // Rollback the transaction in case of an error
      if (transaction) {
        await transaction.rollback();
      }

      // Propagate the error
      throw error;
    }
  },
  login: async (input) => {
    try {
      // Checking if the user exists in our database
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
          as: 'user_role',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          }
        }],
      });

      if (!user) {
        throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid email and password");
      }

      // Comparing the password with the existing hashed password for the user
      const isPasswordValid = await hashCompare(input.password, user.password);
      if (!isPasswordValid) {
        throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid email and password");
      }

      // Generating tokens
      const { token, refresh_token } = await JwtHelper.generateToken({
        user_id: user.id,
        user_firstname: user.firstname,
        user_lastname: user.lastname,
      });

      // Enhancing the user object with tokens
      const enhancedUser = {
        ...user.toJSON(),
        token,
        refresh_token
      };
      delete enhancedUser.password;

      return enhancedUser;
    } catch (error) {
      throw error;
    }
  },
  refreshToken: async (input) => {
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
          as: 'user_role',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          }
        }],
      });
  
      if (!user) {
        throw new CustomExceptionService(STATUS_CODE.HTTP_400_BAD_REQUEST, "Invalid user");
      }
  
      // Generating tokens
      const { token, refresh_token } = await JwtHelper.generateToken({
        user_id: user.id,
        user_firtname: user.firstname,
        user_lastname: user.lastname,
      });
  
      user = { ...user.toJSON(), token, refresh_token };
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }  
};

export default UserService;
