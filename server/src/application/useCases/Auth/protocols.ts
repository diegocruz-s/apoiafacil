import { User } from "../../../domain/entities/User";
import { IResponseLoginUser } from "../../interfaces/IReturnDatasLogin";

export interface IDatasLoginUser {
  email: string;
  password: string;
};

export interface ILoginUserUseCase {
  execute(datas: IDatasLoginUser): Promise<IResponseLoginUser>;
};

export interface ILoginUserRepository {
  findUser(infoUser: { email: string }): Promise<User | null>;
};

export interface ICompareHash {
  run(datas: { password: string, hash: string }): Promise<boolean>;
};

export interface IGenerateToken {
  create(tokenDatas: { id: string, secret: string, expiresIn: string }): Promise<string>;
};

export enum ExpiresIn {
  SEVEN_DAYS='7d',
};
