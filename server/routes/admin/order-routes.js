
const express = require("express");

const {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} = require("../../controllers/admin/order-controller");

const {
  authMiddleware,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Admin-only authorization
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

router.get(
  "/get",
  authMiddleware,
  adminMiddleware,
  getAllOrdersOfAllUsers
);

router.get(
  "/details/:id",
  authMiddleware,
  adminMiddleware,
  getOrderDetailsForAdmin
);

router.put(
  "/update/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;
