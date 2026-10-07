const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  deleteAllOrders,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);

router.get("/list/:userId", getAllOrdersByUser);

router.get("/details/:id", getOrderDetails);

router.delete("/delete-all", deleteAllOrders);

module.exports = router;