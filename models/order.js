const OrderModel = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true

    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    order_number: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    first_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    user_address: {
      type: Sequelize.TEXT('medium'),
      allowNull: false,
    },
    payment_intent_id: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    stripe_response: {
      type: Sequelize.TEXT('medium'),
      allowNull: true
    },
    total_shipping_amount: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: null,
    },
    total_price: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('pending', 'failed', 'success', 'processing', 'shipped', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    is_deleted: {
      type: Sequelize.TINYINT,
      allowNull: false,
      defaultValue: 0,
    }
  }, {
    tableName: 'tbl_order'
  });

  return Order;
};

export default OrderModel;