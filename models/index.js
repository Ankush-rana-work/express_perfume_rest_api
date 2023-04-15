const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DIALECT,POOL } = require("../config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: DIALECT,
  operatorsAliases: 0,
  pool: {
    max: POOL.max,
    min: POOL.min,
    acquire: POOL.acquire,
    idle: POOL.idle,
  },
});


const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.UserModel = require("./userModel")(sequelize, Sequelize);
db.RoleModel = require("./roleModel")(sequelize, Sequelize);
db.MediaModel = require("./mediaModel")(sequelize, Sequelize);
db.ProductModel = require("./productModel")(sequelize, Sequelize);


//relationships
db.ProductModel.hasMany(db.MediaModel,{ as: 'productMedia', foreignKey: 'table_id' });
db.MediaModel.belongsTo(db.ProductModel, { as: 'mediaProduct', foreignKey: 'table_id' });

module.exports = db;