import { randomUUID } from "crypto";
import { BaseEntity } from "./base/BaseEntity";

export interface IDatasUser {
  id?: string;
  email: string, 
  password: string
};

export class User extends BaseEntity {
  private readonly _id: string;
  readonly email: string;
  readonly password: string;

  constructor ({ email, password, id }: IDatasUser) {
    super();
    this._id = id || randomUUID();
    this.email = email;
    this.password = password;
  }

  get id () {
    return this._id;
  };
};