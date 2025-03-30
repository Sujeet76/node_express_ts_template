import { pinoHttp } from 'pino-http';

import { httpLogger } from '../logger/logger';
import pino from 'pino';

export const loggerMiddleware = pinoHttp({
  ...httpLogger,
  stream: pino.multistream([
    {
      stream: process.stdout,
    },
    {
      stream: pino.destination({
        dest: '/logs/app.log',
        sync: false,
        mkdir: true,
      }),
    },
  ]),
});
