const express = require('express');
const router = express.Router();
const {createUser , getUser , getUsersById} = require('../controllers/user.controller');
const {authenticate}= require('../middlewares/auth.middleware')
const { authorize } = require('../middlewares/role.middleware')


router.get('/byAdmin', authenticate,authorize('admin'),getUser);
router.post('/createAdmin',authenticate,authorize('admin'),createUser('admin'));        // Only Admin can Create New Admins
router.post('/',createUser('user'));
router.get('/', authenticate, authorize('user'),getUsersById);

module.exports = router;