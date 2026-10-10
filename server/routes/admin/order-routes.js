
const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  deleteAllOrders,
} = require("../../controllers/shop/order-controller");

const {
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/create", authMiddleware, createOrder);

router.get("/list", authMiddleware, getAllOrdersByUser);

router.get("/details/:id", authMiddleware, getOrderDetails);

router.delete("/delete-all", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  deleteAllOrders(req, res);
});

module.exports = router;
