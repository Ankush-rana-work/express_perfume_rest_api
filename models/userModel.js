module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    
      },
      firstname: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true
      },
      lastname: {
        type: Sequelize.STRING(200),
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      role_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: 1,
      },
      is_active: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      is_delete: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      }
    }, {
        tableName: 'tbl_user'
    });
  
    return User;
  };