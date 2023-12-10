import config from '../config/index.js';
import jwt from 'jsonwebtoken';
import CustomExceptionService from '../customExceptionHandler.js';

const { JWT } = config;
const JwtHelper = {
  generateToken: (payload) => {
    return new Promise((resolve, reject) => {
      try {
        if (!payload) {
          return new Error("Payload is not defined");
        }
        const token = jwt.sign({ payload }, JWT.SECRET, {
          expiresIn: Number(JWT.TOKEN_LIFE),
        });
        const refresh_token = jwt.sign({ payload }, JWT.REFRESH_TOKEN_SECRET, {
          expiresIn: Number(JWT.REFRESH_TOKEN_LIFE),
        });
        resolve({ token, refresh_token });
      } catch (error) {
        reject(error);
      }
    });
  },
  tokenVerify: (token, isRefreshToken = false) => {
    return new Promise((resolve, reject) => {
      try {
        if (!token) {
          reject(new CustomExceptionService(400, "Token is required"));
        }

        const secret_key = !isRefreshToken
          ? JWT.SECRET
          : JWT.REFRESH_TOKEN_SECRET;

        jwt.verify(token, secret_key, function (err, decoded) {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });

      } catch (error) {
        reject(error);
      }
    });
  },
};

export default JwtHelper;
