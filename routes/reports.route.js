const express = require('express');
const router = express.Router();
const {getSalesReport} = require('../controllers/reports.controller')
const {authenticate}= require('../middlewares/auth.middleware')
const {authorize} = require('../middlewares/role.middleware')

router.get('/',authenticate , authorize('admin'),getSalesReport);

module.exports = router;