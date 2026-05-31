const express = require('express');
const router = express.Router();
const {login} = require('../controllers/auth.controller')
const { validateBody } = require('../middlewares/validate.middleware')
const { loginSchema } = require('../validators/user.validator')

router.post('/login', validateBody(loginSchema), login)

module.exports = router;