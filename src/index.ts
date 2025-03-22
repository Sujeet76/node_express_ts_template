import dotenv from 'dotenv';

import { app } from './app';
import { env } from './env';

dotenv.config({
  path: '.env',
});

const startServer = async () => {
  app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`);
  });
};

startServer();
