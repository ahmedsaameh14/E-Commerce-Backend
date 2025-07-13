const express = require('express');
const router = express.Router();
const {getProducts,createProduct, getProductById, getRelatedProducts, updateProduct} = require('../controllers/product.controller');
const {authenticate}= require('../middlewares/auth.middleware')
const {authorize} = require('../middlewares/role.middleware')
const upload = require('../middlewares/upload.middleware')
const paginate = require('../middlewares/paginate.middleware')
const Product = require('../models/product.model')

router.get('/',paginate(Product),getProducts);
router.post('/', authenticate , authorize('admin'), upload.single('img') , createProduct);

router.get('/:id',getProductById);

router.get('/related/:id', getRelatedProducts)

router.put('/:id', upload.single('img'), updateProduct);

module.exports = router;