const AppError = require('../utils/app-error.util');

exports.validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false
    });

    if (error) {
        const errors = error.details.map(
            err => err.message
        );

        return next(
            new AppError(
                errors.join(', '),
                400
            )
        );
    }

    next();
};

exports.validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: false });
  if (error) return next(new AppError(error.details[0].message, 400));
  next();
};
