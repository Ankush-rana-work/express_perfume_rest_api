 const RoleModel = (sequelize, Sequelize) => {
  const Role = sequelize.define("role", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    slug: {
      type: Sequelize.ENUM,
      values: ['admin', 'user']
    },
    name: {
      type: Sequelize.ENUM,
      values: ['Admin', 'User']
    }
  }, {
    tableName: 'tbl_role'
  });

  return Role;
};

export default RoleModel;