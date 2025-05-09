import express from 'express';

import { NotFoundError } from './utils/app-error';
import { errorHandler } from './middlewares/error-handler';
import { loggerMiddleware } from './middlewares/logger-middleware';
import { HelloController } from './controllers/hello';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

const helloController = new HelloController();

// Add a simple health check endpoint
app.route('/').get(helloController.hello);

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

// Error handler middleware should be the last middleware
app.use(errorHandler);

export { app };
