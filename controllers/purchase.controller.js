const Purchase = require('../models/purchase.model');
const Product = require('../models/product.model');

exports.makePurchase = async (req,res)=>{
    const {productId , quantity} = req.body;
    const product = await Product.findById(productId);
    if(!product) return res.status(404).json({message: 'Product Not Found'});

    const purchase = await Purchase.create({
        product: product._id,
        user: req.user._id,
        price: product.price,
        quantity: quantity || 1,
    })
    res.status(201).json({message: 'Purchase Done', purchase})
};

exports.getUserPurchase = async (req,res)=>{
    const purchases = await Purchase.find({user:req.user._id})
    res.status(200).json({message: 'List of Purchases' , data: purchases})
}

exports.getAllUserPurchase = async (req,res)=>{
    const purchases = await Purchase.find().populate("product user" , "name email product price");
    res.status(200).json({ message: "List of user Purchases", data: purchases });
}