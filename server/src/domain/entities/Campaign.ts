import { randomUUID } from 'node:crypto';
import { BaseEntity } from './base/BaseEntity';
import { StatusEnum } from './base/StatusEnum';

export interface IValidCampaign {
  errors: (string | null)[];
  valid: boolean;
}

export interface IDatasCampaign {
  id?: string;
  actualValue?: number;
  userId: string;
  categoryId: string;
  name: string;
  description: string;
  expectedValue: number;
  photos: string[];
  recipient: string;
  pixKey: string;
  expiresIn: Date,
}

export class Campaign extends BaseEntity {
  private readonly _id: string;
  readonly userId: string;
  readonly categoryId: string;
  readonly name: string;
  readonly description: string;
  readonly favoritesList: string[];
  readonly expectedValue: number;
  readonly actualValue: number;
  readonly createdAt: Date;
  readonly expiresIn: Date;
  readonly photos: string[];
  readonly recipient: string;
  readonly status: StatusEnum;
  readonly pixKey: string;

  constructor({
    id,userId,categoryId,name,description,expectedValue,photos,expiresIn,
    recipient,pixKey,actualValue
  }: IDatasCampaign) {
    super();
    this._id = id || randomUUID();
    this.userId = userId;
    this.categoryId = categoryId;
    this.name = name;
    this.description = description;
    this.favoritesList = [];
    this.expectedValue = expectedValue;
    this.actualValue = actualValue || 0;
    this.createdAt = new Date();
    this.expiresIn = expiresIn;
    this.photos = photos;
    this.recipient = recipient;
    this.status = StatusEnum.ACTIVE;
    this.pixKey = pixKey;
  }

  isValid(): { errors: (string | null)[]; valid: boolean; } {
    const baseValidation = super.isValid();
    const errors = [...baseValidation.errors];

    if(this.expectedValue < 500) {
      errors.push('Expected value must be at least 500!');
    };
    
    if (!this.isAtLeastTwoWeeksAhead(this.expiresIn, this.createdAt)) {
      errors.push('The campaign must be at least two weeks long');
    }

    return {
      errors,
      valid: errors.length === 0,
    };
  };

  isAtLeastTwoWeeksAhead (dateToCheck: Date, referenceDate: Date) {
    const dateToCheckTimestamp = dateToCheck.getTime();
    const referenceDateTimestamp = referenceDate.getTime();

    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;

    return dateToCheckTimestamp >= referenceDateTimestamp + twoWeeksInMilliseconds;
  };

  get id() {
    return this._id;
  }
}
