import { IDatasConnectMongo } from "../database/MongoDatabase";

export const datasMongoUri: IDatasConnectMongo = {
  user: process.env.MONGODB_USERNAME!,
  password: process.env.MONGODB_PASSWORD!,
  instance: process.env.MONGODB_INSTANCE!,
  port: process.env.MONGODB_PORT!,
  database: process.env.MONGODB_DATABASE!,
};