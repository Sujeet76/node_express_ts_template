import express from 'express';

import { errorHandler } from './middlewares/error-handler';
import { ApiResponse } from './utils/api-response';

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.route('/').get((req, res) => {
  res.json(new ApiResponse(200, 'Welcome to the API'));
});

// @ts-expect-error it is a custom middleware to handle async errors
app.use(errorHandler);

export { app };
