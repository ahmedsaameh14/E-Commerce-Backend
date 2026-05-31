const Joi = require('joi');
const AppError = require('../utils/app-error.util');

const schema = Joi.object({
  name: Joi.string().min(1).required()
});

exports.nameSchema = schema;
