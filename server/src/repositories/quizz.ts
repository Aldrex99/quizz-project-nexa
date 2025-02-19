import { SortOrder } from "mongoose";
import Quizz, { IQuizzDocument } from "../models/quizz";
import { console } from "inspector";

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

  async findById(id: string) {
    return Quizz.findById(id, { __v: 0 })
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

  async findByAuthorId(auhtorId: string) {
    return Quizz.find({ author_id: auhtorId }, { __v: 0 })
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

  async updateById(id: string, userId: string, data: Partial<IQuizzDocument>) {
    console.log("On passe par ici");
    const quizzToUpdate = await Quizz.findOne({ id, author_id: userId });

    if (!quizzToUpdate) {
      console.log("Quizz not found");
    }

    console.log("quizzToUpdate :", quizzToUpdate);

    return Quizz.findOneAndUpdate({ id, author_id: userId }, data, {
      new: true,
    });
  },

  async deleteById(id: string, userId: string) {
    return Quizz.findOneAndDelete({ _id: id, author_id: userId });
  },
};
