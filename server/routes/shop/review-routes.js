const express = require("express");

const {
  addProductReview,
  getProductReviews,
} = require("../../controllers/shop/product-review-controller");

const router = express.Router();
const { authMiddleware } = require("../../controllers/auth/auth-controller");

router.post("/add", authMiddleware, addProductReview);
router.get("/:productId", getProductReviews);

module.exports = router;