const express = require('express');
const router = express.Router();
const {makePurchase , getUserPurchase , getAllUserPurchase} = require('../controllers/purchase.controller')
const {authenticate} = require('../middlewares/auth.middleware');
const {authorize} = require('../middlewares/role.middleware')
const { sensitiveActionLimiter } = require('../middlewares/rateLimit.middleware')

router.post('/', authenticate , authorize('user') , sensitiveActionLimiter, makePurchase);
router.get('/' , authenticate , authorize('user'), getUserPurchase);

router.get('/all' , authenticate , authorize('admin'), getAllUserPurchase);

module.exports = router;