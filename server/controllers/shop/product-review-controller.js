const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
  try {
    const { productId, reviewMessage, reviewValue } = req.body;

    const userId = req.user.id;
    const userName = req.user.userName;

    console.log("USER ID:", userId);
    console.log("PRODUCT ID:", productId);

    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
    });

    console.log("FOUND ORDER:", order);

    if (!order) {
      return res.status(403).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    const newReview = new ProductReview({
      productId,
      userId,
      userName,
      reviewMessage,
      reviewValue,
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      data: newReview,
    });
  } catch (e) {
    console.log("ADD REVIEW ERROR:", e);

    res.status(500).json({
      success: false,
      message: "Error while adding review.",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ProductReview.find({ productId });

    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error",
    });
  }
};

module.exports = {
  addProductReview,
  getProductReviews,
};