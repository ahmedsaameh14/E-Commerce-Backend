const express = require('express');
const router = express.Router()
const {addToCart,removeFromCart,confirmPriceChange,updateCart,getUserProductInCart} = require('../controllers/cart.controller')
const {authenticate}  = require('../middlewares/auth.middleware')
const {authorize}  = require('../middlewares/role.middleware');

router.post("/",authenticate, addToCart )
router.put("/remove",authenticate, removeFromCart )
router.put('/confirm-price', authenticate, confirmPriceChange)
router.put("/:id",authenticate, updateCart )
router.get("/",authenticate,authorize('user') , getUserProductInCart )


module.exports = router