import { Request, Response } from 'express';

import pino from 'pino';

import { env } from '../env';

const transport =
  env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
          ignore: 'pid,hostname',
        },
      }
    : undefined;

export const logger = pino({
  level: env.LOG_LEVEL,
  transport,
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});

export const httpLogger = (req: Request, _res: Response) => {
  if (env.NODE_ENV === 'production') {
    return logger.child({
      correlationId: req.headers['x-correlation-id'] || 'none',
      userAgent: req.headers['user-agent'],
    });
  }
  return logger;
};
