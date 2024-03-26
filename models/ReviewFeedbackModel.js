const ReviewFeedbackModel = (sequelize, Sequelize) => {
  const ReviewFeedback = sequelize.define("reviewFeedback", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
  
    },
    review_id: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.BIGINT,
      primaryKey: true
    },
    type: {
      type: Sequelize.ENUM,
      values: ['likes', 'helpful']
    }
  }, {
      tableName: 'tbl_review_feedback'
  });
  return ReviewFeedback;
};

export default ReviewFeedbackModel;