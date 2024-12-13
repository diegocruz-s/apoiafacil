import 'dotenv/config';
import express, { Express } from 'express';
import { authRoutes } from './infra/http/routes/auth';
import { DatabaseMongoDb } from './infra/database/MongoDatabase';
import { datasMongoUri } from './infra/config/dbConn';
import cors from 'cors';
import { createUser } from './infra/database/seed';
import { campaignRoutes } from './infra/http/routes/campaign';
import { paymentRoutes } from './infra/http/routes/payment';

// console.log('process.env.MONGODB_USERNAME!: ', process.env.MONGODB_USERNAME!)
// console.log('process.env.MONGODB_PASSWORD!: ', process.env.MONGODB_PASSWORD!)
// console.log('process.env.MONGODB_INSTANCE!: ', process.env.MONGODB_INSTANCE!)
// console.log('process.env.MONGODB_PORT!: ', process.env.MONGODB_PORT!)
// console.log('process.env.MONGODB_DATABASE!: ', process.env.MONGODB_DATABASE!)

class AppController {
  app: Express;

  constructor() {
    this.app = express();
    this.cors();
    this.middlewares();
    this.routes();
  };

  async seed () {
    await createUser({
      email: 'diegoszcruz1001@gmail.com',
      password: 'Diego@123',
      environment: 'production',
    });
  };

  async database () {
    await DatabaseMongoDb.getInstance(datasMongoUri);
  };

  middlewares () {
    this.app.use(express.json());
  };

  routes () {
    this.app.use('/auth', authRoutes);  
    this.app.use('/campaign', campaignRoutes); 
    this.app.use('/payment', paymentRoutes); 
  }; 
 
  cors () {
    this.app.use(cors());
  };

  async start (port: number) {
    await this.database();
    await this.seed();
 
    this.app.listen(port, () => console.log(`Server running on port ${port}...`))
  };
};

const appController = new AppController();

export {
  appController,
};
