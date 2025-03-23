import { type NextFunction, type Request, type Response } from 'express';

import { ZodError } from 'zod';

import { ApiError } from '../utils/api-error';

/**
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
export const errorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err;

  // check whether it is instance of ApiError
  if (!(error instanceof ApiError)) {
    // if not create a new instance of ApiError
    // const statusCode =
    //   error.statusCode || error instanceof mongoose.Error ? 400 : 500;
    // const message = error.message || 'Something went wrong';
    let statusCode = 500;
    let message = 'something went wrong';
    let errors;
    let stack: string | undefined = '';

    if (error instanceof ZodError) {
      statusCode = 400;
      errors = error.issues;
      stack = error.stack;
      message = error.errors.map((e) => e.message).join('\n');
    }
    error = new ApiError(
      statusCode,
      message,
      errors || error.errors || [],
      stack
    );
  }

  // send error response
  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };
  return res.status(error.statusCode).json(response);
};
