const express = require('express');
const router = express.Router();
const subCategoryController = require('../controllers/subcategory.controller');
const { validateBody } = require('../middlewares/validate.middleware')
const { nameSchema } = require('../validators/subcategory.validator')

// Create
router.post('/', validateBody(nameSchema), subCategoryController.createSubCategory);

// Read all
router.get('/', subCategoryController.getSubCategories);


module.exports = router;
