module.exports = (sequelize, Sequelize)=>{
    const Attribute = sequelize.define("media", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
      
        },
        name: {
            type: Sequelize.STRING(200),
            allowNull: false
        },
        slug:{
            type: Sequelize.STRING(200),
            allowNull: false
        }
      }, {
          tableName: 'tbl_attributes'
    });
    
    return Attribute;
}