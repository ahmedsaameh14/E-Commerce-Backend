const express = require('express');
const router = express.Router();
const {createUser , getUser} = require('../controllers/user.controller');
const {authenticate}= require('../middlewares/auth.middleware')


router.get('/', getUser);
router.post('/',createUser('user'));

module.exports = router;