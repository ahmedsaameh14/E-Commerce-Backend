const express = require('express');
const router = express.Router();
const {makePurchase , getUserPurchase , getAllUserPurchase} = require('../controllers/purchase.controller')
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware')

router.post('/', authenticate , authorize('user') , makePurchase);
router.get('/' , authenticate , authorize('user'), getUserPurchase);

router.get('/all' , authenticate , authorize('admin'), getAllUserPurchase);

module.exports = router;