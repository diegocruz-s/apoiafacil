import { IFindUserByIdRepository } from "../../../../application/useCases/campaign/create/protocols";
import { UserModel } from "../../../../infra/models/User";
import { User } from "../../../entities/User";
import { MongoMappers } from "../mappers/MongoMappers";

export class FindUserByIdRepository implements IFindUserByIdRepository {
  async find(userId: string): Promise<User | null> {
    const user = await UserModel.findById(userId).exec();

    if (!user) return null;

    return MongoMappers.mongoToObjUser(user);
  };
};