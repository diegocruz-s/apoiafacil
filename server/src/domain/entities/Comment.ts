import { randomUUID } from "crypto";
import { BaseEntity } from "./base/BaseEntity";

export interface IDatasComment {
  id?: string;
  userId: string;
  campaignId: string;
  text: string;
}

export class Comment extends BaseEntity {
  private readonly _id: string;
  readonly userId: string;
  readonly campaignId: string;
  readonly text: string;
  readonly createdAt: Date;

  constructor({ id, userId, campaignId, text }: IDatasComment) {
    super();
    this._id = id || randomUUID();
    this.userId = userId;
    this.campaignId = campaignId;
    this.text = text;
    this.createdAt = new Date();
  };

  get id() {
    return this._id;
  }
};