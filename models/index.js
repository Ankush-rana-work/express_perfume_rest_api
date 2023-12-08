const config = require("../config");
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DIALECT,POOL } = config;

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

db.RoleModel = require("./roleModel")(sequelize, Sequelize);
db.UserModel = require("./userModel")(sequelize, Sequelize);
db.MediaModel = require("./mediaModel")(sequelize, Sequelize);
db.ProductModel = require("./productModel")(sequelize, Sequelize);
db.AttributeModel = require("./attributeModel")(sequelize, Sequelize);
db.AttributeDataModel = require("./attributeDataModel")(sequelize, Sequelize);

//relationships
db.UserModel.belongsTo(db.RoleModel, {as: 'user_role', foreignKey: 'role_id'});
db.ProductModel.hasMany(db.MediaModel,{ as: 'product_media', foreignKey: 'table_id' });
db.MediaModel.belongsTo(db.ProductModel, { as: 'media_product', foreignKey: 'table_id' });


module.exports = db;