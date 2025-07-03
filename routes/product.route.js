const express = require('express');
const router = express.Router();
const {getProducts,createProduct} = require('../controllers/product.controller');
const {authenticate}= require('../middlewares/auth.middleware')
const {authorize} = require('../middlewares/role.middleware')
const upload = require('../middlewares/upload.middleware')
const paginate = require('../middlewares/paginate.middleware')
const Product = require('../models/product.model')

router.get('/',paginate(Product),getProducts);
router.post('/', authenticate , authorize('admin'), upload.single('img') , createProduct);

module.exports = router;