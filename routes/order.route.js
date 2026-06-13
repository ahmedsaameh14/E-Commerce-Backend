const express = require("express")
const router = express.Router()
const orderControllers = require("../controllers/order.controller")
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { sensitiveActionLimiter } = require('../middlewares/rateLimit.middleware')
const { createOrder, getMyOrders, getMyOrderById ,cancelMyOrder } = orderControllers

//admin
router.get("/byAdmin", authenticate, authorize('admin'), orderControllers.getAllOrders);
router.get("/:id/byAdmin", authenticate, authorize('admin'), orderControllers.getOrderById);
router.post("/send/:id/byAdmin", authenticate, authorize('admin'), orderControllers.addOrderToShipping);
router.put("/status/:id/byAdmin", authenticate, authorize('admin'), orderControllers.updateStatusOrder);

// user 
router.get("/",authenticate , getMyOrders);
router.get("/:id", authenticate, getMyOrderById);
router.post("/", authenticate, authorize('user'), sensitiveActionLimiter, createOrder);
router.put("/cancel/:id/status", authenticate, authorize('user'), sensitiveActionLimiter, cancelMyOrder);

module.exports = router