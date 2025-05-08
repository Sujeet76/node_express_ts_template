import { Request, Response, NextFunction, RequestHandler } from 'express';
import { logger } from '../logger/logger';

type AsyncFunction<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResBody = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReqBody = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ReqQuery = any,
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wraps an async controller function to handle errors automatically
 * This eliminates the need for try/catch blocks in every controller
 * @param fn The async controller function to wrap
 */
export const asyncHandler = <
  P = unknown,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
>(
  fn: AsyncFunction<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      logger.error(
        {
          err: error,
          req: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            params: req.params,
            query: req.query,
          },
        },
        'Error caught in asyncHandler'
      );
      // Only pass to error handler if response hasn't been sent yet
      if (!res.headersSent) {
        next(error);
      }
    }
  };
};
