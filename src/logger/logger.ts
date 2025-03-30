import pino from 'pino';
import { Request, Response } from 'express';

// Create a logger instance with appropriate configuration
export const logger = pino({
  level: process.env.LOG_LEVEL,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        }
      : undefined,
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  // base: undefined, // Removes pid and hostname from logs
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'res.headers["set-cookie"]',
    ],
    censor: '***SENSITIVE DATA REDACTED***',
  },
});

// For request logging with pino-http - will be configured in the middleware
export const httpLogger = {
  // Configuration for pino-http
  logger,
  redact: [
    'req.headers.authorization',
    'req.headers.cookie',
    'res.headers["set-cookie"]',
  ],
  autoLogging: {
    ignore: (req: Request) =>
      req.url?.includes('/health') || req.url?.includes('/metrics'),
  },
  // Custom success message
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.url} completed with ${res.statusCode}`;
  },
  // Custom error message
  customErrorMessage: (req: Request, res: Response, err: Error) => {
    return `${req.method} ${req.url} failed with ${res.statusCode} - ${err.message}`;
  },
  customLogLevel: (req: Request, res: Response, err: Error | undefined) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  // Custom props for logging
  customProps: (req: Request, _res: Response) => {
    return {
      requestId: req.id,
      userAgent: req.headers['user-agent'],
    };
  },
};
