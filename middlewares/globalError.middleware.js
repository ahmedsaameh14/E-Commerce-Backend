const logger = require('../utils/logger');
const AppError = require('../utils/app-error.util');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle MongoDB Cast Error
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    err = new AppError(message, 400);
  }

  // Handle MongoDB Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} Already Exist`;
    err = new AppError(message, 400);
  }

  // Handle MongoDB Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map(e => e.message)
      .join(', ');
    err = new AppError(message, 400);
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid Token';
    err = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token Expired';
    err = new AppError(message, 401);
  }

  // Handle MongoDB Connection Errors
  if (err.name === 'MongoNetworkError') {
    const message = 'Database connection error';
    err = new AppError(message, 500);
  }

  // Handle syntax errors
  if (err.name === 'SyntaxError') {
    const message = 'Invalid JSON syntax';
    err = new AppError(message, 400);
  }

  // Handle reference errors
  if (err instanceof ReferenceError) {
    const message = 'Internal server error - Reference error';
    err = new AppError(message, 500);
  }

  // Handle type errors
  if (err instanceof TypeError) {
    const message = 'Invalid data type provided';
    err = new AppError(message, 400);
  }

  // Operational errors (from AppError) - send detailed message
  if (err.isOperational) {
    logger.error(err);
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  } 
  // Programming or unknown error - don't leak details
  else {
    logger.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
    });
  }
};