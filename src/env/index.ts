import { ZodError, z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

let _config: EnvSchema;

try {
  _config = EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = 'Missing required values in .env:\n';
    error.issues.map((issue) => {
      message += issue.path[0] + '\n';
    });
    throw new Error(message);
  } else {
    throw error;
  }
}

export const env = Object.freeze(_config);
