const OrderItemModel = (sequelize, Sequelize) => {
  const OrderModel = sequelize.define("orderItem", {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true

    },
    order_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    product_id: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    product_qty: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    product_price: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    product_total_price: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    refund_amount: {
      type: Sequelize.TEXT('medium'),
      allowNull: true,
    },
    Active: {
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
    tableName: 'tbl_order_item'
  });

  return OrderModel;
};

export default OrderItemModel;