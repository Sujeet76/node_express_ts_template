import express from 'express';

import { v4 as uuidv4 } from 'uuid';

import { errorHandler } from './middlewares/error-handler';
import { loggerMiddleware } from './middlewares/logging';
import { ApiResponse } from './utils/api-response';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware
app.use(loggerMiddleware);

// Add correlation ID middleware
app.use((req, res, next) => {
  req.correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
  res.setHeader('x-correlation-id', req.correlationId);
  next();
});

// Add a simple health check endpoint
app.route('/').get((req, res) => {
  res.json(new ApiResponse(200, 'Welcome to the API'));
});

// @ts-expect-error it is a custom middleware to handle async errors
app.use(errorHandler);

export { app };
