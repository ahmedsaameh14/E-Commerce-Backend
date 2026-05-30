const Product = require('../models/product.model');
const SubCategory = require('../models/subcategory.model');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catch-async.util');
const AppError = require('../utils/app-error.util');

// This is for using name of SubCategory not ID
exports.createProduct = catchAsync(async (req, res, next) => {
        const { name, desc, price, stock, subCategory } = req.body;
        
        if(!name || !desc || !price || !subCategory){
            return next(new AppError('Please provide all required fields', 400));
        }
        
        if(!req.file){
            return next(new AppError('Product image is required', 400));
        }
        
        const imgURL = req.file.path;

        let subCategoryId = subCategory;
        if (!mongoose.Types.ObjectId.isValid(subCategory)) {
            const subCatDoc = await SubCategory.findOne({ name: subCategory });
            if (!subCatDoc) {
                return next(new AppError('Invalid subCategory name', 400));
            }
            subCategoryId = subCatDoc._id;
        }

        const myProduct = await Product.create({
            name,
            desc,
            price,
            stock: parseInt(stock) || 0,
            imgURL,
            subCategory: subCategoryId
        });

        res.status(201).json({ message: 'Product Created', myProduct });
});


// Pagination 
exports.getProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json(res.paginatedResult);
});

exports.getProductById = catchAsync(async (req,res,next)=>{
    const id = req.params.id;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next(new AppError('Invalid product ID', 400));
    }
    
    const product = await Product.findById(id);
    if(!product){
        return next(new AppError('Product Not Found', 404));
    }
    
    res.status(200).json({message: 'Product Data',data:product});
});

exports.getRelatedProducts = catchAsync(async (req,res,next)=>{
    const id = req.params.id;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next(new AppError('Invalid product ID', 400));
    }
    
    const product = await Product.find({_id: {$ne: id}}).limit(6);
    if(!product || product.length === 0){
        return next(new AppError('No related products found', 404));
    }
    
    res.status(200).json({message: 'Related Products',data:product});
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        return next(new AppError('Invalid product ID', 400));
    }

    const product = await Product.findById(id);
    if (!product) {
        return next(new AppError('Product Not Found', 404));
    }

    const { name, desc, price, stock, subCategory } = req.body;

    let imgURL = product.imgURL;
    if (req.file) {
        imgURL = req.file.path;
    }

    let subCategoryId = subCategory || product.subCategory;
    if (subCategory && !mongoose.Types.ObjectId.isValid(subCategory)) {
        const subCatDoc = await SubCategory.findOne({ name: subCategory });
        if (!subCatDoc) {
            return next(new AppError('Invalid subCategory name', 400));
        }
        subCategoryId = subCatDoc._id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        id,
        {
            name: name || product.name,
            desc: desc || product.desc,
            price: price || product.price,
            stock: parseInt(stock) || product.stock,
            imgURL,
            subCategory: subCategoryId
        },
        { new: true }
    );

    res.status(200).json({ message: 'Product Updated', updatedProduct });
});


// Normal Get Data
// exports.getProducts = async (req, res) => {
//   const products = await Product.find();
//   res.status(200).json({ message: "list of products", data: products });
// };

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: 'Product Not Found'
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Product Deleted Successfully'
    });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to delete product',
      error: err.message
    });
  }
};