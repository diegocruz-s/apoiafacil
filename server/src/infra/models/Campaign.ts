import mongoose, { Document, Schema } from 'mongoose';
import { StatusEnum } from '../../domain/entities/base/StatusEnum';

export interface ICampaignModel extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  favoritesList: string[];
  expectedValue: number;
  actualValue: number;
  createdAt: Date;
  expiresIn: Date;
  photos: string[];
  recipient: string;
  status: StatusEnum;
  pixKey: string;
};

const CampaignSchema = new Schema<ICampaignModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    favoritesList: [{ type: String }],
    expectedValue: { type: Number, required: true, min: 500 },
    actualValue: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiresIn: { type: Date, required: true },
    photos: [{ type: String }],
    recipient: { type: String, required: true },
    status: { type: String, enum: Object.values(StatusEnum), default: StatusEnum.ACTIVE },
    pixKey: { type: String, required: true },
  },
  { timestamps: true },
);

const CampaignModel = mongoose.model<ICampaignModel>('Campaign', CampaignSchema);

export { 
  CampaignModel,
};