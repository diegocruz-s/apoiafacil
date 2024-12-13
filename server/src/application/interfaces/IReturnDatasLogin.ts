import { User } from "../../domain/entities/User";

export interface IResponseLoginUser {
  datas?: {
    user: Omit<User, 'password'>,
    token: string,
  },
  errors?: string[];
};
