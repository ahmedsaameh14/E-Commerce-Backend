const Joi = require('joi');
const AppError = require('../utils/app-error.util');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

exports.createUserSchema = createUserSchema;
exports.loginSchema = loginSchema;
