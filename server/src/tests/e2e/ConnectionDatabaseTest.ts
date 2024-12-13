import dotenv from 'dotenv';
dotenv.config({ path: '.env-testing' });
import { DatabaseMongoDb } from "../../infra/database/MongoDatabase";

export const connectionDatabaseTest = async () => {
  const datasMongoUri = {
    user: process.env.MONGODB_USERNAME!,
    password: process.env.MONGODB_PASSWORD!,
    instance: process.env.MONGODB_INSTANCE!,
    port: process.env.MONGODB_PORT!,
    database: process.env.MONGODB_DATABASE!,
  };

  await DatabaseMongoDb.getInstance(datasMongoUri);
};
