import { logger } from '../logger/logger';
import { ZodError, z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number(),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),

  API_PREFIX: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

let _config: EnvSchema;

try {
  _config = EnvSchema.parse(process.env);
  process.env = Object.assign(process.env, _config); // Update process.env with parsed values
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n';
    error.issues.map((issue) => {
      message += issue.path[0] + '\n';
    });
    logger.error(message);
    throw new Error(message);
  } else {
    throw error;
  }
}

export const env = Object.freeze(_config);
