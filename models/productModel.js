const ProductModel = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      subtitle: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      item_country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      handling_time: {
        type:  Sequelize.STRING(100),
        allowNull: false,
      },
      upc: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 0,
      },
      manufacturer_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 0,
      },
      brand: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      volume: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      shop_for: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      fragrance_name: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      quantity:{
        type: Sequelize.INTEGER,
        allowNull: true
      },
      type: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      is_deleted: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      }
    }, {
        tableName: 'tbl_product'
    });
  
    return Product;
  };

  export default ProductModel;