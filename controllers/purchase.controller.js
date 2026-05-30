const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');
const catchAsync = require('../utils/catch-async.util');
const AppError = require('../utils/app-error.util');

exports.makePurchase = catchAsync(async (req,res,next)=>{
    const {productId , quantity} = req.body;
    
    if(!productId){
        return next(new AppError('Product ID is required', 400));
    }
    
    const product = await Product.findById(productId);
    if(!product) return next(new AppError('Product Not Found', 404));

    const purchase = await Purchase.create({
        product: product._id,
        user: req.user._id,
        price: product.price,
        quantity: quantity || 1,
    })
    res.status(201).json({message: 'Purchase Done', purchase})
});

exports.getUserPurchase = catchAsync(async (req,res,next)=>{
    const purchases = await Purchase.find({user:req.user._id})
    res.status(200).json({message: 'List of Purchases' , data: purchases})
});

exports.getAllUserPurchase = catchAsync(async (req,res,next)=>{
    const purchases = await Purchase.find().populate("product user" , "name email product price");
    res.status(200).json({ message: "List of user Purchases", data: purchases });
})