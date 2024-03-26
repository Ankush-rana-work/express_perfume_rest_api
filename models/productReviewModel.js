const ProductReviewModel = (sequelize, Sequelize) => {
  const ProductReview = sequelize.define("productReview", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.TEXT('long'),
      allowNull: false
    },
    rating: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    product_id: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    is_deleted: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: 'tbl_product_review'
  });
  return ProductReview;
};

export default ProductReviewModel;