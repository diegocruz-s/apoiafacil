import mongoose, { Document, Schema } from 'mongoose';

export interface IUserModel extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string
};

const UserSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<IUserModel>('User', UserSchema);

export {
  UserModel,
};
