const Cart = require("../models/cart.model")
const Product = require("../models/product.model")
const mongoose = require("mongoose");
const catchAsync = require('../utils/catch-async.util');
const AppError = require('../utils/app-error.util');


exports.addToCart = catchAsync(async (req, res, next) => {
    const session = await mongoose.startSession()
    session.startTransaction();
    try {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError("Product ID and quantity are required", 400));
        }
        
        const product = await Product.findById(productId).session(session);
        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return next(new AppError("Product not found", 404));
        }

        const userId = req.user._id;
        let cartItem = await Cart.findOne({
            userId,
            productId,
            isPurchased: false
        });
        
        if (cartItem) {
            const priceChanged = product.price !== cartItem.currentPrice
            cartItem = await Cart.findByIdAndUpdate(cartItem._id, {
                quantity: cartItem.quantity + quantity || quantity,
                currentPrice: product.price,
                priceChanged: priceChanged || cartItem.priceChanged,
                removedAt: null
            }, { new: true, session })
        }
        else {
            if (product.stock < quantity) {
                await session.abortTransaction();
                session.endSession();
                return next(new AppError(`Cannot purchase this quantity. Only ${product.stock} in stock.`, 400));
            }

            cartItem = await Cart.create([{
                userId: req.user._id,
                sessionId: req.user ? null : req.body.sessionId,
                productId: productId,
                quantity: quantity,
                price: product.price,
                originalPrice: product.price,
                currentPrice: product.price,
            }], { session });
            
            await Product.findOneAndUpdate(
                { _id: productId, stock: { $gte: quantity } },
                { $inc: { stock: -quantity } },
                { new: true, session }
            );
        }

        await session.commitTransaction();
        session.endSession();
        
        let message = "Product added to cart successfully";
        if (cartItem.priceChanged) {
            message = "Product added to cart. Note: Price has changed since last time!";
        }

        res.status(201).json({ message: message, data: cartItem, priceChanged: cartItem.priceChanged });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
});


// FIXED CONTROLLER
exports.getUserProductInCart = catchAsync(async (req, res, next) => {
        const cart = await Cart.find({ userId: req.user._id })
            .populate("productId", "name stock imgURL");

        res.status(200).json({ message: "Product in cart", data: cart });
});



exports.getAllUserProductInCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.find().populate('product user', "name email price  ");
    res.status(200).json({ message: "list of user purchases", data: cart })
});


exports.getAbandonedProducts = catchAsync(async (req, res, next) => {
    const abandoned = await Cart.find({
        isPurchased: false,
        removedAt: { $exists: true }
    }).populate("productId userId");

    res.status(200).json({ message: "Abandoned products", data: abandoned });
});


exports.updateCart = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const { quantity } = req.body;

        if (!id || !quantity || quantity < 1) {
            return next(new AppError("Invalid cart item ID or quantity.", 400));
        }

        const updatedCartItem = await Cart.findByIdAndUpdate(
            { _id: id },
            { quantity },
            { new: true }
        );
        if (!updatedCartItem) {
            return next(new AppError("Cart item not found.", 404));
        }

        res.status(200).json({
            message: "Cart item updated successfully.",
            data: updatedCartItem
        });
});


exports.removeFromCart = catchAsync(async (req, res, next) => {
        const { id } = req.body;

        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return next(new AppError("Cart item not found.", 404));
        }

        cartItem.quantity = 0;
        cartItem.removedAt = new Date();
        await cartItem.save();

        res.status(200).json({ message: "Item removed from cart." });
});


exports.confirmPriceChange = catchAsync(async (req, res, next) => {
        const { id } = req.body;
        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return next(new AppError("Cart item not found.", 404));
        }
        
        cartItem.priceChanged = false;
        cartItem.originalPrice = cartItem.currentPrice;
        cartItem.removedAt = null;

        await cartItem.save();
        res.status(200).json({ message: "Price confirmed", data: cartItem });
});