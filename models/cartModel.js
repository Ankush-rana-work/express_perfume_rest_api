const CartModel = (sequelize, Sequelize) => {
    const Cart = sequelize.define("cart", {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true
    
      },
      user_id: {
        type: Sequelize.BIGINT,
        allowNull: false
      },
      product_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    }, {
        tableName: 'tbl_cart'
    });
  
    return Cart;
  };

  export default CartModel;