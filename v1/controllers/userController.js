const UserService = require("../service/userService");
const { sendError, sendSucess } = require("../../utils/commonHelper");
const Message = require("../../local/message");
const JwtHelper = require("../../utils/jwtHelper");

const UserController = {
  /**
 * @swagger
 * tags:
 *   name: user
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
*                       example: "ankush0094@gmail.com"
*                   password:
*                       type: string,
*                       description: User password,
*                       example: "ank@123456"
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
      const user = await UserService.register(req);
      sendSucess(res, 200, Message.USER_LIST, user);
    } catch (error) {
      next(error);
    }
  },
  /**
 * @swagger
 * tags:
 *   name: user
 *   description: The user managing API
 * /v1/user/login:
 *   get:
 *     summary: User Login
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *           description: User email.
 *           example: "ankush0094@gmail.com"
 *       - in: query
 *         name: password
 *         schema:
 *           type: string
 *           description: User password.
 *           example: "ank@123456"
 *     responses:
 *       '200' :
 *         description: success
 *       '500' :
 *         description: internal server error
 *       '400' :
 *         description: invalid data
 */

  login: async (req, res, next) => {
    try {
      const user = await UserService.login(req.query);
      sendSucess(res, 200, Message.USER_LOGGED_IN, user);
    } catch (error) {
      next(error);
    }
  },
  /**
 * @swagger
 * tags:
 *   name: user
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
  refreshToken: async (req, res, next) =>{
    try{
      const user = await UserService.refreshToken(req.body);
      sendSucess(res, 200, Message.USER_LOGGED_IN, user);
    }catch(error){
      next(error);
    }
  },
};

module.exports = UserController;
