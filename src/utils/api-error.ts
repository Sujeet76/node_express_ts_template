// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { errorHandler } from '../middlewares/error-handler';

/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client
 */
class ApiError extends Error {
  statusCode: number;
  error: unknown[];
  success: boolean;

  /**
   * Creates an instance of ApiError.
   * @param {number} statusCode - The HTTP status code of the error.
   * @param {string} message - The error message.
   * @param {Array} [error=[]] - Additional error details.
   * @param {string} [stack=""] - The stack trace of the error.
   */
  constructor(
    statusCode: number,
    message: string,
    error: unknown[] = [],
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
