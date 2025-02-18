import { SortOrder } from "mongoose";
import Quizz, { IQuizzDocument } from "../models/quizz";

export const QuizzRepository = {
  async create(data: Partial<IQuizzDocument>) {
    try {
      const quizz = new Quizz(data);
      await quizz.save();
      return;
    } catch (error: any) {
      throw error;
    }
  },

  async getFilteredAndPaginatedQuizzes(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder
  ) {
    const quizzes = await Quizz.find(filter, { __v: 0, questions: 0 })
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .populate("author", "username")
      .populate("categories", "name");

    const total = await Quizz.countDocuments(filter);

    return { quizzes, total };
  },

  async findById(id: string) {
    return Quizz.findById(id, { __v: 0 })
      .populate("author", "username")
      .populate("categories", "name");
  },

  async findByAuthorId(auhtorId: string) {
    return Quizz.find({ author: auhtorId }, { __v: 0, questions: 0 })
      .populate("author", "username")
      .populate("categories", "name");
  },

  // TODO : fix this error (Cast to ObjectId failed for value \"{\n  id: '67b506d31a39c3713153aa5b',\n  author: [Function: stringToObjectId]\n}\" (type Object) at path \"_id\" for model \"Quizz\")
  async updateById(id: string, userId: string, data: Partial<IQuizzDocument>) {
    return Quizz.findByIdAndUpdate({ id, author: userId }, data, { new: true })
      .populate("author", "username")
      .populate("categories", "name");
  },

  async deleteById(id: string, userId: string) {
    return Quizz.findByIdAndDelete({ id, author: userId })
      .populate("author", "username")
      .populate("categories", "name");
  },
};
