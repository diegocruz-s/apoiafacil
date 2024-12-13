import mongoose from "mongoose";

export interface IDatasConnectMongo {
  user: string;
  password: string;
  database: string;
  port: string;
  instance: string;
};

class DatabaseMongoDb {
  private static instance: DatabaseMongoDb | null = null;

  public static async getInstance(datas: IDatasConnectMongo): Promise<DatabaseMongoDb> {
    if(DatabaseMongoDb.instance === null) {         
       
      DatabaseMongoDb.instance = new DatabaseMongoDb();
      await DatabaseMongoDb.instance.connect(datas);
    };
    
    return DatabaseMongoDb.instance;
  };

  private async connect (datas: IDatasConnectMongo) {
    const { user, password, instance, port, database } = datas;
    const uri = `mongodb://${user}:${password}@${instance}:${port}/${database}`;    
    
    try {
      await mongoose.connect(uri);
      console.log('MongoDB initialized!');      
    } catch (error) {
      console.log('error connection: ', error);
    };
  };
};

export {
  DatabaseMongoDb
};
