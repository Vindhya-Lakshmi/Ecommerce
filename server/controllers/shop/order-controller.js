
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");

// CREATE COD ORDER
const createOrder = async (req, res) => {
  try {
    const { cartItems, addressInfo, totalAmount, cartId } = req.body;

    const newlyCreatedOrder = new Order({
      userId: req.user.id,
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

    if (cartId) {
      await Cart.findByIdAndDelete(cartId);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newlyCreatedOrder,
    });
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// GET ORDERS FOR THE LOGGED-IN USER
const getAllOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("GET ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// GET ORDER DETAILS ONLY IF IT BELONGS TO THE USER
const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

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
  } catch (error) {
    console.log("GET ORDER DETAILS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};
// CANCEL ORDER — only the owner can cancel an eligible order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id,
        orderStatus: { $in: ["pending", "confirmed"] },
      },
      {
        $set: {
          orderStatus: "cancelled",
          orderUpdateDate: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message:
          "Order not found, or it can no longer be cancelled.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    });
  } catch (error) {
    console.log("CANCEL ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel order.",
    });
  }
};

// DELETE ALL ORDERS
// Restrict this operation to admins in the routes.
const deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});

    res.status(200).json({
      success: true,
      message: "All orders deleted successfully",
    });
  } catch (error) {
    console.log("DELETE ALL ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  cancelOrder,
  deleteAllOrders,
};
