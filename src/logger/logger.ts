import pino from 'pino';
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import pinoPretty from 'pino-pretty';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'app.log');

const prettyStream = pinoPretty({
  colorize: true,
  translateTime: 'SYS:standard',
  ignore: 'pid,hostname',
});

const streams = [
  { stream: prettyStream },
  { stream: fs.createWriteStream(logFilePath, { flags: 'a' }) },
];

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'res.headers["set-cookie"]',
      ],
      censor: '***SENSITIVE DATA REDACTED***',
    },
  },
  pino.multistream(streams)
);

export const httpLogger = {
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
  customProps: (req: Request, _res: Response) => {
    return {
      requestId: req.id,
      userAgent: req.headers['user-agent'],
    };
  },
};
