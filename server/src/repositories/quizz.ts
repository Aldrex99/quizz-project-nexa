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
    const quizzes = await Quizz.find(filter, { __v: 0 })
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

  async findByAuthorId(userId: string) {
    return Quizz.find({ author: userId }, { __v: 0 })
      .populate("author", "username")
      .populate("categories", "name");
  },

  async updateById(id: string, data: Partial<IQuizzDocument>) {
    return Quizz.findByIdAndUpdate(id, data, { new: true })
      .populate("author", "username")
      .populate("categories", "name");
  },

  async deleteById(id: string) {
    return Quizz.findByIdAndDelete(id)
      .populate("author", "username")
      .populate("categories", "name");
  },
};
