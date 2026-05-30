const SubCategory = require('../models/subcategory.model');
const catchAsync = require('../utils/catch-async.util');
const AppError = require('../utils/app-error.util');

// Create a new SubCategory
exports.createSubCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    
    if(!name){
        return next(new AppError('SubCategory name is required', 400));
    }

    const subCategory = await SubCategory.create({ name });

    res.status(201).json({ message: 'SubCategory created', data: subCategory });
});

// Get all SubCategories
exports.getSubCategories = catchAsync(async (req, res, next) => {
    const subCategories = await SubCategory.find();
    res.status(200).json({ message: 'List of subcategories', data: subCategories });
});