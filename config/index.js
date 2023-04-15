require('dotenv').config();

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

const local = {
    DB_HOST: process.env.LOCAL_DB_HOST,
    DB_USER: process.env.LOCAL_DB_USER,
    DB_PASS: process.env.LOCAL_DB_PASSWORD,
    DB_NAME: process.env.LOCAL_DATABASE,
    DIALECT: "mysql",
    // pool is optional, it will be used for Sequelize connection pool configuration
    POOL: {
        max: 2,
        min: 0,
        acquire: 3000,
        idle: 0
    },
    BASE_URL: process.env.LOCAL_BASE_URL,
    PORT:3000,
    JWT: {
        TOKEN_LIFE: 30 * 24 * 60 * 60, // Note: in seconds!,(day*hour*min*sec)
        REFRESH_TOKEN_LIFE: 30 * 24 * 60 * 60, // Note: in seconds!, (day*hour*min*sec)
        SECRET: process.env.JWT_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
    HASH_SALT : 10
}

const config = {local};
console.log(config);
module.exports = config[env];

