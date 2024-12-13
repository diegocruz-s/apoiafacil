import { randomUUID } from "crypto";
import { BaseEntity } from "./base/BaseEntity";
import { StatusEnum } from "./base/StatusEnum";

export interface IDatasDonation {
  id?: string;
  userId: string;
  campaignId: string;
  amount: number;
  dateDonation: Date;
  status: StatusEnum;
};

export class Donation extends BaseEntity {
  private readonly _id: string;
  readonly userId: string;
  readonly campaignId: string;
  readonly amount: number;
  readonly dateDonation: Date;
  readonly status: StatusEnum
  
  constructor ({
    id,
    userId,
    campaignId,
    amount,
    dateDonation,
    status,
  }: IDatasDonation) {
    super();
    this._id = id || randomUUID();
    this.userId = userId;
    this.campaignId = campaignId;
    this.amount = amount;
    this.dateDonation = dateDonation;
    this.status = status;
  };

  get id() {
    return this._id;
  }
};