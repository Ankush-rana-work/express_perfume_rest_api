const CategoryModel = (sequelize, Sequelize) => {
    const Cart = sequelize.define("category", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
        tableName: 'tbl_category'
    });
  
    return Cart;
  };

  export default CategoryModel;