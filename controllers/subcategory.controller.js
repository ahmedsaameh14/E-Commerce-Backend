const SubCategory = require('../models/subcategory.model');

// Create a new SubCategory
exports.createSubCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const subCategory = await SubCategory.create({ name });

    res.status(201).json({ message: 'SubCategory created', data: subCategory });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create subcategory', error: err.message });
  }
};

// Get all SubCategories
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find();
    res.status(200).json({ message: 'List of subcategories', data: subCategories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get subcategories', error: err.message });
  }
};