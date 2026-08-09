const Order = require("../../models/Order");
const Cart = require("../../models/Cart");

// CREATE COD ORDER
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      cartId,
    } = req.body;

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,

      orderStatus: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",

      totalAmount,

      orderDate: new Date(),
      orderUpdateDate: new Date(),

      paymentId: "",
      payerId: "",
    });

    await newlyCreatedOrder.save();

    // Delete cart after successful order creation
    if (cartId) {
      await Cart.findByIdAndDelete(cartId);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newlyCreatedOrder,
    });
  } catch (e) {
    console.log("CREATE ORDER ERROR:", e);

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


// GET ALL ORDERS BY USER
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log("GET ORDERS ERROR:", e);

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


// GET SINGLE ORDER DETAILS
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log("GET ORDER DETAILS ERROR:", e);

    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


// EXPORT FUNCTIONS
module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
};