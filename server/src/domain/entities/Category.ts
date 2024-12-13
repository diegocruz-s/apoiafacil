import { randomUUID } from "crypto";
import { BaseEntity } from "./base/BaseEntity";

export interface IDatasCategory {
  id?: string;
  name: string, 
};

export class Category extends BaseEntity {
  private readonly _id: string;
  readonly name: string;

  constructor ({ name, id }: IDatasCategory) {
    super();
    this._id = id || randomUUID();
    this.name = name;
  }

  get id () {
    return this._id;
  };


};