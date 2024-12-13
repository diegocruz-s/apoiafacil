import mongoose, { Schema } from "mongoose";

export interface IHistoryDonationModel extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  donationId: mongoose.Types.ObjectId;
}

const HistoryDonationSchema = new Schema<IHistoryDonationModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    donationId: { type: Schema.Types.ObjectId, ref: 'Donation', required: true },
  },
  { timestamps: true },
);

const HistoryDonationModel = mongoose.model<IHistoryDonationModel>('HistoryDonation', HistoryDonationSchema);

export { HistoryDonationModel };
