import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger';

// Define controller handler function type
export type ControllerFunction<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<T>;

/**
 * Wraps an async controller function to handle errors automatically
 * This eliminates the need for try/catch blocks in every controller
 * @param fn The async controller function to wrap
 */
export const asyncHandler = <T>(fn: ControllerFunction<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };
};
