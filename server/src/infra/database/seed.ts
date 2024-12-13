
import dotenv from 'dotenv';
import { UserModel } from "../models/User";
import { DatabaseMongoDb, IDatasConnectMongo } from './MongoDatabase';
import bcrypt from "bcryptjs";

interface IDatasSeedUser {
  email: string;
  password: string;
  environment?: 'test' | 'development' | 'production';
};

function loadEnv(environment: string) {
  const result = environment === 'test' ? 
    dotenv.config({ path: '.env-testing' }) : 
    dotenv.config({ path: '.env' });

  if (result.error) {
    throw result.error;
  }
}

export async function createUser({ email, password, environment = 'development' }: IDatasSeedUser) {
  loadEnv(environment);

  try {
    const datasMongoUri: IDatasConnectMongo = {
      user: process.env.MONGODB_USERNAME!,
      password: process.env.MONGODB_PASSWORD!,
      instance: process.env.MONGODB_INSTANCE!,
      port: process.env.MONGODB_PORT!,
      database: process.env.MONGODB_DATABASE!,
    };
    await DatabaseMongoDb.getInstance(datasMongoUri);

    const hashPwd = bcrypt.hashSync(password, 4);
    const newUser = new UserModel({
      email,
      password: hashPwd,
    });

    await newUser.save();
  } catch (error) {
    console.error('Erro na criação do usuário:', error);
  }
}

if (require.main === module) {
  const [email, password] = process.argv.slice(2);
  
  if (email && password) {  
    createUser({ email, password })
      .then(() => {
        console.log(`Usuário ${email} criado com sucesso`)
        process.exit();
      })
      .catch((err) => console.log('Error na criação de usuário: ', err));
  } else {
    console.error('Provide data to create the user!');
  }
};
