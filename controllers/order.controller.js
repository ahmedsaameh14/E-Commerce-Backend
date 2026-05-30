
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const catchAsync = require('../utils/catch-async.util');
const AppError = require('../utils/app-error.util');

// admin
exports.getAllOrders = catchAsync(async (req, res, next) => {
        const orders = await Order.find().populate("userId products.productId", "name email product_title price")

        res.status(200).json({ message: "Orders fetched successfully", orders });
});

exports.getOrderById = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const order = await Order.findById(id).populate("userId", "name email").populate("products.productId", "name imgURL price");
        
        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        res.status(200).json({ message: "Order fetched successfully", order });
});

exports.addOrderToShipping = catchAsync(async (req, res, next) => {
        const { orderId, status } = req.body;

        if(!orderId || !status){
            return next(new AppError("Order ID and status are required", 400));
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new AppError("Order not found", 404));
        }
        
        if (status === "shipped") {
            return next(new AppError("Order is already shipped", 400));
        }

        await Order.findByIdAndUpdate(orderId, {
            status: "shipped"
        }, { new: true });

        res.status(200).json({ message: "Order marked as shipped", order });
});

exports.updateStatusOrder = catchAsync(async (req, res, next) => {
        const { orderId, status } = req.body;
        
        if(!orderId || !status){
            return next(new AppError("Order ID and status are required", 400));
        }
        
        const order = await Order.findById(orderId);

        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        const updateStatusOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        res.status(200).json({ message: `Order status updated to ${status}`, updateStatusOrder });
});



// Users

exports.createOrder = catchAsync(async (req, res, next) => {
        const userId = req.user._id;
        const cartItems = await Cart.find({ userId, isPurchased: false }).populate("productId");

        if (cartItems.length === 0) {
            return next(new AppError("Cart is empty", 400));
        }

        const previousOrderCount = await Order.countDocuments({ userId });
        const products = cartItems.map((item) => ({
            productId: item.productId._id,
            product_title: item.productId.product_title,
            product_image: item.productId.product_image,
            quantity: item.quantity || 1,
            price: item.productId.price,
        }));

        const newOrder = await Order.create({
            userId,
            products,
            orderNumber: previousOrderCount + 1,
            status: "pending",
            shippingData: req.body.shippingData,
            paymentMethod: req.body.paymentMethod || "Cash",
        });

        await Cart.deleteMany({ userId });

        res.status(201).json({ message: "Order created", order: newOrder });
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
        const userId = req.user._id;

        const orders = await Order.find({ userId }).populate("products.productId").sort({ createdAt: -1 })
        if (!orders || orders.length === 0) {
            return next(new AppError("No orders found for this user", 404));
        }

        res.status(200).json({ message: "Orders fetched", orders });
});

exports.getMyOrderById = catchAsync(async (req, res, next) => {
        const orderId = req.params.id;
        const order = await Order.findById(orderId).populate("products.productId", "name imgURL qauntity");
        
        if(!order){
            return next(new AppError("Order not found", 404));
        }
        
        res.status(200).json({ order })
});

exports.cancelMyOrder = catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        if (order.status !== "pending") {
            return next(new AppError("Only pending orders can be cancelled", 400));
        }

        const updateStatusOrder = await Order.findByIdAndUpdate(
            id,
            { status: "cancelled" },
            { new: true }
        );
        res.status(200).json({ message: "Order cancelled", updateStatusOrder });
})