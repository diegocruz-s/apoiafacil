import { randomUUID } from "crypto";
import { BaseEntity } from "./base/BaseEntity";

export interface IDatasHistoryDonation {
  id?: string;
  userId: string, 
  donationId: string,
};

export class HistoryDonation extends BaseEntity {
  private readonly _id: string;
  readonly userId: string;
  readonly donationId: string;

  constructor ({ userId, donationId, id }: IDatasHistoryDonation) {
    super();
    this._id = id || randomUUID();
    this.userId = userId;
    this.donationId = donationId;
  }

  get id () {
    return this._id;
  };
};