import express from 'express';

import { ApiResponse } from './utils/app-response';
import { NotFoundError } from './utils/app-error';
import { errorHandler } from './middlewares/error-handler';
import { loggerMiddleware } from './middlewares/logger-middleware';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// Add a simple health check endpoint
app.route('/').get((req, res) => {
  res.json(new ApiResponse(200, 'Welcome to the API'));
});

// 404 handler for undefined routes
app.use('*', (req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Error handler middleware should be the last middleware
app.use(errorHandler);

export { app };
