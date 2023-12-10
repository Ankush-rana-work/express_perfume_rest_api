const MediaModel = (sequelize, Sequelize) => {
    const Media = sequelize.define("media", {
        id: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true
      
        },
        name: {
          type: Sequelize.STRING(200),
          allowNull: false
        },
        table_id:{
          type: Sequelize.BIGINT,
          allowNull: true
        },
        type: {
            type: Sequelize.ENUM,
            values: ['image', 'video'],
            allowNull: false,
        },
        table_name: {
          type: Sequelize.STRING(200),
          allowNull: true
        },
      }, {
          tableName: 'tbl_media'
    });
    
    return Media;
};

export default MediaModel;