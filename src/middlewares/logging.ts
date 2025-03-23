import { type Request, type Response } from 'express';

import { pinoHttp } from 'pino-http';

import { logger } from '../logger/logger';

export const loggerMiddleware = pinoHttp({
  logger,
  serializers: {
    req: (req: Request) => {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        headers: {
          host: req.headers.host,
          origin: req.headers.origin,
          'user-agent': req.headers['user-agent'],
          'x-correlation-id': req.headers['x-correlation-id'],
        },
        remoteAddress: req?.socket?.remoteAddress,
      };
    },
    res: (res: Response) => {
      return {
        statusCode: res.statusCode,
        headers: res.header,
      };
    },
  },
  customProps: (req: Request) => ({
    correlationId: req.headers['x-correlation-id'] || 'none',
  }),
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    }
    if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
});
