const BlogModel = (sequelize, Sequelize) => {
    const Product = sequelize.define("blog", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      description: {
        type:  Sequelize.TEXT('medium'),
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
        tableName: 'tbl_blog'
    });
  
    return Product;
  };

  export default BlogModel;