const express = require('express');
const router = express.Router();
const {getProducts,createProduct, getProductById, getRelatedProducts, updateProduct , deleteProduct} = require('../controllers/product.controller');
const {authenticate}= require('../middlewares/auth.middleware')
const {authorize} = require('../middlewares/role.middleware')
const upload = require('../middlewares/upload.middleware')
const paginate = require('../middlewares/paginate.middleware')
const Product = require('../models/product.model')
const { validateBody } = require('../middlewares/validate.middleware')
const { createProductSchema, updateProductSchema, requireProductImage } = require('../validators/product.validator')

router.get('/',paginate(Product),getProducts);
router.post('/', authenticate , authorize('admin'), upload.single('img') , validateBody(createProductSchema), requireProductImage, createProduct);

router.get('/:id',getProductById);

router.get('/related/:id', getRelatedProducts)

router.put('/:id', upload.single('img'), validateBody(updateProductSchema), updateProduct);

router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;