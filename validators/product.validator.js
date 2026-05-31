const Joi = require('joi');
const AppError = require('../utils/app-error.util');

const createProductSchema = Joi.object({
  name: Joi.string().min(1).required(),
  desc: Joi.string().min(1).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).optional(),
  subCategory: Joi.string().min(1).required()
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  desc: Joi.string().min(1).optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  subCategory: Joi.string().min(1).optional()
});

exports.createProductSchema = createProductSchema;
exports.updateProductSchema = updateProductSchema;

exports.requireProductImage = (req, res, next) => {
  if (!req.file) return next(new AppError('Product image is required', 400));
  next();
};
