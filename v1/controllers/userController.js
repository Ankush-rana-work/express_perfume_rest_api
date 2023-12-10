import UserService from '../service/userService.js';
import CommonHelper from '../../utils/commonHelper.js';
import Message from '../../local/message.js';
import JwtHelper from '../../utils/jwtHelper.js';

const { sendError, sendSucess } = CommonHelper;
const UserController = {
  /**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /v1/user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*               properties:
*                   firstname:
*                       type: string
*                       description: User firstname.
*                       example: "ankush"
*                   email:
*                       type: string
*                       description: User email.
*                       example: "xyz@gmail.com"
*                   password:
*                       type: string,
*                       description: User password,
*                       example: "xyz@123456"
*                   type:
*                       type: string,
*                       description: User password,
*                       example: "user"
*                       enum: [admin, user]
*     responses:
*       '200' :
*         description: success
*       '500' :
*         description: internal server error
*       '400' :
*         description: invalid data
*
 */
  register: async (req, res, next) => {
    try {
      const user = await UserService.register(req.body);
      sendSucess(res, 200, Message.USER_LIST, user);
    } catch (error) {
      next(error);
    }
  },
  /**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /v1/user/login:
 *   post:
 *     summary: User Login
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*               properties:
*                   email:
*                       type: string
*                       description: User email.
*                       example: "xyz@gmail.com"
*                   password:
*                       type: string,
*                       description: User password,
*                       example: "xyz@123456"
*     responses:
*       '200' :
*         description: success
*       '500' :
*         description: internal server error
*       '400' :
*         description: invalid data
*
 */
  login: async (req, res, next) => {
    try {
      const user = await UserService.login(req.body);
      sendSucess(res, 200, Message.USER_LOGGED_IN, user);
    } catch (error) {
      next(error);
    }
  },
  /**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /v1/user/refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*               properties:
*                   token:
*                       type: string
*                       description: User firstname.
*                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOjM4LCJ1c2VyX2ZpcnRuYW1lIjoiYW5rdXNoIiwidXNlcl9sYXN0bmFtZSI6bnVsbH0sImlhdCI6MTY4MDYxMDUwNywiZXhwIjoxNjgzMjAyNTA3fQ.OnUXV8bz0GF05bMyUNM0UDudMZ3oIs-y0xoxZVUiTdw"
*     responses:
*       '200' :
*         description: success
*       '500' :
*         description: internal server error
*       '400' :
*         description: invalid data
*
 */
  refreshToken: async (req, res, next) => {
    try {
      const user = await UserService.refreshToken(req.body);
      sendSucess(res, 200, Message.USER_LOGGED_IN, user);
    } catch (error) {
      next(error);
    }
  },
};

export default UserController;
