const AttributeDataModel = (sequelize, Sequelize)=>{
    const AttributeData = sequelize.define("attributeData", {
        id: {
            type: Sequelize.BIGINT,
            autoIncrement: true,
            primaryKey: true
      
        },
        attribute_id: {
            type: Sequelize.BIGINT,
            allowNull: true
        },
        name:{
            type: Sequelize.STRING(200),
            allowNull: false
        }
      }, {
          tableName: 'tbl_attribute_data'
    });
    
    return AttributeData;
}

export default AttributeDataModel;