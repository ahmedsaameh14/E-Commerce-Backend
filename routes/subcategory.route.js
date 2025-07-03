const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subcategory.controller');

// Create
router.post('/', subCategoryController.createSubCategory);

// Read all
router.get('/', subCategoryController.getSubCategories);


module.exports = router;
