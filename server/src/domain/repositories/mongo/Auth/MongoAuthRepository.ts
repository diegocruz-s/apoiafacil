import { ILoginUserRepository } from "../../../../application/useCases/Auth/protocols";
import { UserModel } from "../../../../infra/models/User";
import { User } from "../../../entities/User";
import { MongoMappers } from "../mappers/MongoMappers";


export class MongoAuthRepository implements ILoginUserRepository {
  async findUser(infoUser: { email: string; }): Promise<User | null> {
    try {
      const userByEmail = await UserModel.findOne({ email: infoUser.email });

      if (!userByEmail) return null;

      return MongoMappers.mongoToObjUser(userByEmail);
    } catch (error: any) {
      throw new Error(`Error MongoDB: ${error.message}`);
    };
  };
};
 