import app from './api';

import dotenv from 'dotenv';
dotenv.config();

async function startServer(
  port: number,
  host: string = 'localhost'
): Promise<void> {

  app.express.listen(port, host, () => {
    console.info(
      '\x1b[36m' +
      'API' +
      '\x1b[33m ' +
      'is ready to use and online on' +
      '\x1b[32m ' +
      `${host} at port ${port}` +
      '\x1b[33m!\x1b[34m'
    );
  });
}

const PORT = <number>(process.env.PORT ? process.env.PORT : 3333);
const HOSTNAME = process.env.HOSTNAME;
startServer(PORT, HOSTNAME);