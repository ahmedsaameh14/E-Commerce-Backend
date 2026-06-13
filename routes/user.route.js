const express = require('express');
const router = express.Router();
const {createUser , getUser , getUsersById} = require('../controllers/user.controller');
const {authenticate}= require('../middlewares/auth.middleware')
const { authorize } = require('../middlewares/role.middleware')
const { validateBody } = require('../middlewares/validate.middleware')
const { createUserSchema } = require('../validators/user.validator')
const { createAccountLimiter } = require('../middlewares/rateLimit.middleware')


router.get('/byAdmin', authenticate,authorize('admin'),getUser);
router.post('/createAdmin', authenticate, authorize('admin'), createAccountLimiter, validateBody(createUserSchema), createUser('admin'));        // Only Admin can Create New Admins
router.post('/', createAccountLimiter, validateBody(createUserSchema), createUser('user'));
router.get('/', authenticate, authorize('user'),getUsersById);

module.exports = router;