import { Document, Model, model, Schema } from 'mongoose';

export interface ICategory {
  name: string;
}

export interface ICategoryDocument extends ICategory, Document {}

export const CategorySchema = new Schema<ICategoryDocument>({
  name: { type: String, required: true },
});

const CategoryModel: Model<ICategoryDocument> = model<ICategoryDocument>(
  'Category',
  CategorySchema,
);

export default CategoryModel;
