import { SortOrder } from "mongoose";
import Quizz, { IQuizzDocument } from "../models/quizz";

export const QuizzRepository = {
  async create(data: Partial<IQuizzDocument>) {
    try {
      const quizz = new Quizz(data);
      await quizz.save();
      return quizz._id;
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
      .populate({
        path: "author_id",
        select: "username avatarLink",
        model: "User",
      })
      .populate({
        path: "category_ids",
        select: "name",
        model: "Category",
      });

    const total = await Quizz.countDocuments(filter);

    return { quizzes, total };
  },

  async findById(_id: string) {
    return Quizz.findById(_id, { __v: 0 })
      .populate({
        path: "author_id",
        select: "username avatarLink",
        model: "User",
      })
      .populate({
        path: "category_ids",
        select: "name",
        model: "Category",
      });
  },

  async findQuizzQuestionsByQuizzId(_id: string) {
    return Quizz.findById(_id, { questions: 1 });
  },

  async findByAuthorId(author_id: string) {
    return Quizz.find({ author_id }, { __v: 0, questions: 0 })
      .populate({
        path: "author_id",
        select: "username avatarLink",
        model: "User",
      })
      .populate({
        path: "category_ids",
        select: "name",
        model: "Category",
      });
  },

  async updateQuizzById(
    _id: string,
    author_id: string,
    data: Partial<IQuizzDocument>
  ) {
    return Quizz.findOneAndUpdate({ _id, author_id }, data, {
      new: true,
    });
  },

  async deleteQuizzById(_id: string, author_id: string) {
    return Quizz.findOneAndDelete({ _id, author_id });
  },
};
