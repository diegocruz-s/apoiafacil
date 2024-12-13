import mongoose, { Schema } from "mongoose";

export interface ICategoryModel extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
}

const CategorySchema = new Schema<ICategoryModel>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const CategoryModel = mongoose.model<ICategoryModel>('Category', CategorySchema);

export { 
  CategoryModel, 
};
