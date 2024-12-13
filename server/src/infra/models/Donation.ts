import mongoose, { Schema } from "mongoose";
import { StatusEnum } from "../../domain/entities/base/StatusEnum";

export interface IDonationModel extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  amount: number;
  dateDonation: Date;
  status: StatusEnum;
}

const DonationSchema = new Schema<IDonationModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    amount: { type: Number, required: true },
    dateDonation: { type: Date, default: Date.now },
    status: { type: String, enum: Object.values(StatusEnum), required: true },
  },
  { timestamps: true },
);

const DonationModel = mongoose.model<IDonationModel>('Donation', DonationSchema);

export { 
  DonationModel,
};
