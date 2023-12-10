import config from "../config/index.js";
import Sequelize from "sequelize";
import RoleModel from '../models/roleModel.js'
import UserModel from '../models/userModel.js';
import MediaModel from '../models/mediaModel.js';
import AttributeModel from "../models/attributeModel.js";
import AttributeDataModel from "../models/attributeDataModel.js";
import ProductModel from "./productModel.js";

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DIALECT, POOL } = config;
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

db.RoleModel = RoleModel(sequelize, Sequelize);
db.UserModel = UserModel(sequelize, Sequelize);
db.MediaModel = MediaModel(sequelize, Sequelize);
db.ProductModel = ProductModel(sequelize, Sequelize);
db.AttributeModel = AttributeModel(sequelize, Sequelize);
db.AttributeDataModel = AttributeDataModel(sequelize, Sequelize);

//relationships
db.UserModel.belongsTo(db.RoleModel, {as: 'user_role', foreignKey: 'role_id'});
db.ProductModel.hasMany(db.MediaModel,{ as: 'product_media', foreignKey: 'table_id' });
db.MediaModel.belongsTo(db.ProductModel, { as: 'media_product', foreignKey: 'table_id' });
db.AttributeModel.hasMany(db.AttributeDataModel,{ as:'attribute_data', foreignKey: 'attribute_id' });

export default db;