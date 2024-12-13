import mongoose, { Schema } from "mongoose";

export interface ICommentModel extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  campaignId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
};

const CommentSchema = new Schema<ICommentModel>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const CommentModel = mongoose.model<ICommentModel>('Comment', CommentSchema);

export { 
  CommentModel, 
};