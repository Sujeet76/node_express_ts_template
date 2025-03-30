import { EnvSchema } from '../env/env';

declare global {
  namespace NodeJs {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ProcessEnv extends EnvSchema {}
  }
}
