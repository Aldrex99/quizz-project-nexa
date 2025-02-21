import { Document, Model, model, ObjectId, Schema } from 'mongoose';

export interface IQuizz {
  title: string;
  description: string;
  imageLink?: string;
  imageKey?: string;
  questions: {
    _id?: string | ObjectId;
    text: string;
    options: {
      _id?: string | ObjectId;
      key: string;
      value: string;
    }[];
    isMultipleChoice: boolean;
    correctAnswer: string[];
    points: number;
  }[];
  author_id: string | ObjectId;
  author?: {
    _id?: string | ObjectId;
    username?: string;
    avatarLink?: string;
  };
  category_ids: (string | ObjectId)[];
  categories?: {
    _id?: string | ObjectId;
    name?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizzDocument extends IQuizz, Document {}

export const QuizzSchema = new Schema<IQuizzDocument>({
  author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category_ids: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageLink: { type: String },
  imageKey: { type: String },
  questions: [
    {
      text: { type: String, required: true },
      options: [
        {
          key: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      isMultipleChoice: { type: Boolean, required: true },
      imageLink: { type: String },
      correctAnswer: { type: [String], required: true },
      points: { type: Number, required: true },
    },
  ],
});

const QuizzModel: Model<IQuizzDocument> = model<IQuizzDocument>('Quizz', QuizzSchema);

export default QuizzModel;
