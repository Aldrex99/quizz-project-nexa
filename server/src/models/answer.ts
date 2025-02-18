import { Document, Model, model, ObjectId, Schema } from "mongoose";

export interface IAnswer {
  user: {
    _id: string | ObjectId;
    username: string;
  };
  quizz: {
    _id: string | ObjectId;
    title: string;
  };
  answers: {
    question_id: string;
    answer: string[];
  }[];
  score: number;
  totalScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnswerDocument extends IAnswer, Document {}

export const AnswerSchema = new Schema<IAnswerDocument>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  quizz: { type: Schema.Types.ObjectId, ref: "Quizz", required: true },
  answers: [
    {
      question_id: { type: String, required: true },
      answer: { type: [String], required: true },
    },
  ],
  score: { type: Number, required: true },
  totalScore: { type: Number, required: true },
});

const AnswerModel: Model<IAnswerDocument> = model<IAnswerDocument>(
  "Answer",
  AnswerSchema
);

export default AnswerModel;
