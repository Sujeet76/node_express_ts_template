import dotenv from 'dotenv';
dotenv.config({
  path: '.env',
});

import { IncomingMessage, Server, ServerResponse } from 'http';
import { app } from './app';
import { logger } from './logger/logger';
import { env } from './env/env';

const signals = ['SIGINT', 'SIGTERM'] as const;

process.on('uncaughtException', (error) => {
  logger.fatal(error, "Uncaught Exception");
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.fatal(error, "Unhandled Rejection");
  process.exit(1);
});

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

const shutdownGracefully = () => {
  logger.info('Shutting down server...');
  server?.close(() => {
    logger.info('Server closed gracefully');
    process.exit(0);
  });
};

// Set up signal handlers once
signals.forEach((signal) => {
  process.once(signal, () => {
    logger.info(`Received ${signal}. Initiating graceful shutdown...`);
    shutdownGracefully();
  });
});

const startServer = () => {
  server = app.listen(env.PORT, () => {
    logger.info(`Server is running at http://localhost:${env.PORT}`);
  });
  return server;
};

startServer()
