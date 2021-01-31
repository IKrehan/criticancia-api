import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import router from './routes';

class Api {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
    this.express.use(helmet());
    this.express.use(
      cors({
        origin: '*',
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      })
    );
  }

  private routes(): void {
    this.express.use('/api', router);
  }
}

const api = new Api();
export default api;