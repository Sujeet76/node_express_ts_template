import { ErrorRequestHandler } from 'express';
import { AppError, InternalServalError } from '../utils/app-error';
import { env } from '../env/env';

/**
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (err instanceof Error) {
    error = new InternalServalError(err.message, err.stack);
  } else {
    error = new InternalServalError('Something went wrong', err);
  }

  res.status(error.statusCode).json({
    message: error.message || 'An error occurred',
    status: error.statusCode || 500,
    error: error.details || null,
    stack: env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

export { errorHandler };
