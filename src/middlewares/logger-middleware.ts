import { pinoHttp } from 'pino-http';
import { httpLogger } from '../logger/logger';

// Create pino HTTP logger using the existing configured logger
export const loggerMiddleware = pinoHttp({
  ...httpLogger,
});
