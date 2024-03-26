import config from "../config/index.js";
import Sequelize from "sequelize";
import RoleModel from '../models/roleModel.js'
import UserModel from '../models/userModel.js';
import MediaModel from '../models/mediaModel.js';
import AttributeModel from "../models/attributeModel.js";
import AttributeDataModel from "../models/attributeDataModel.js";
import ProductModel from "./productModel.js";
import BlogModel from "./blogModel.js";
import CartModel from "./cartModel.js";
import OrderItemModel from "./orderItem.js";
import OrderModel from "./order.js";
import CategoryModel from "./categoryModel.js";
import ProductReviewModel from "./productReviewModel.js";
import ReviewFeedbackModel from "./ReviewFeedbackModel.js";

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
db.CategoryModel = CategoryModel(sequelize, Sequelize);
db.ProductModel = ProductModel(sequelize, Sequelize);
db.AttributeModel = AttributeModel(sequelize, Sequelize);
db.AttributeDataModel = AttributeDataModel(sequelize, Sequelize);
db.BlogModel = BlogModel(sequelize, Sequelize);
db.CartModel = CartModel(sequelize, Sequelize);
db.OrderModel = OrderModel(sequelize, Sequelize);
db.OrderItemModel = OrderItemModel(sequelize, Sequelize);
db.ProductReviewModel = ProductReviewModel(sequelize, Sequelize);
db.ReviewFeedbackModel = ReviewFeedbackModel(sequelize, Sequelize);

//relationships belongs to
db.UserModel.belongsTo(db.RoleModel, { as: 'user_role', foreignKey: 'role_id' });
db.MediaModel.belongsTo(db.ProductModel, { as: 'media_product', foreignKey: 'table_id' });
db.ProductModel.belongsTo(db.AttributeDataModel, { as: 'attr_brand', foreignKey: 'brand' });
db.ProductModel.belongsTo(db.AttributeDataModel, { as: 'attr_volume', foreignKey: 'volume' });
db.ProductModel.belongsTo(db.AttributeDataModel, { as: 'attr_shop_for', foreignKey: 'shop_for' });
db.ProductModel.belongsTo(db.AttributeDataModel, { as: 'attr_fragrancename', foreignKey: 'fragrance_name' });
db.ProductModel.belongsTo(db.AttributeDataModel, { as: 'attr_type', foreignKey: 'type' });
db.ProductModel.belongsTo(db.CategoryModel, { as: 'category', foreignKey: 'category_id' });
db.BlogModel.belongsTo(db.UserModel, { as: 'user', foreignKey: 'user_id' });
db.CartModel.belongsTo(db.UserModel, { as: 'user', foreignKey: 'user_id' });
db.CartModel.belongsTo(db.ProductModel, { as: 'product', foreignKey: 'product_id' });
db.AttributeDataModel.belongsTo(db.AttributeModel, { as: 'attr_name', foreignKey: 'attribute_id' });
db.ProductReviewModel.belongsTo(db.ProductModel, { as: 'product', foreignKey: 'product_id' });
db.ProductReviewModel.belongsTo(db.UserModel, { as: 'user', foreignKey: 'user_id' });
db.ReviewFeedbackModel.belongsTo(db.UserModel, { as: 'user', foreignKey: 'user_id' });
db.ReviewFeedbackModel.belongsTo(db.ProductReviewModel, { as: 'review', foreignKey: 'review_id' });

// relationships has many 
db.ProductModel.hasMany(db.MediaModel, { as: 'product_media', foreignKey: 'table_id', scope: {
  table_name: 'product',
}});
db.AttributeModel.hasMany(db.AttributeDataModel, { as: 'attribute_data', foreignKey: 'attribute_id' });
db.BlogModel.hasMany(db.MediaModel, { as: 'blog_meda', foreignKey: 'table_id' });
db.CategoryModel.hasMany(db.MediaModel, { as: 'category_media', foreignKey: 'table_id', scope: {
  table_name: 'category',
}});
db.ProductReviewModel.hasMany(db.MediaModel, { as: 'review_media', foreignKey: 'table_id', scope: {
  table_name: 'product_review',
}});
db.ProductReviewModel.hasMany(db.ReviewFeedbackModel, { as: 'favourite', foreignKey: 'review_id', scope: {
  type: 'likes',
}});
db.ProductReviewModel.hasMany(db.ReviewFeedbackModel, { as: 'helpful', foreignKey: 'review_id', scope: {
  type: 'helpful',
}});
// relationship has one


export default db;