import { SortOrder } from "mongoose";
import Answer, { IAnswerDocument } from "../models/answer";
import path from "path";

export const AnswerRepository = {
  async create(data: Partial<IAnswerDocument>) {
    try {
      const answer = new Answer(data);
      const newAnswer = await answer.save();
      await newAnswer.populate({
        path: "user_id",
        select: "username",
        model: "User",
      });

      await newAnswer.populate({
        path: "quizz_id",
        select: "title imageLink",
        model: "Quizz",
      });

      return newAnswer;
    } catch (error: any) {
      throw error;
    }
  },

  async getFilteredAndPaginatedAnswers(
    filter: Record<string, any>,
    skip: number,
    limit: number,
    sortBy: string,
    sortOrder: SortOrder
  ) {
    const answers = await Answer.find(filter, { __v: 0 })
      .limit(limit)
      .skip(skip)
      .sort({ [sortBy]: sortOrder })
      .populate({
        path: "user_id",
        select: "username",
        model: "User",
      })
      .populate({
        path: "quizz_id",
        select: "title imageLink",
        model: "Quizz",
      });

    const total = await Answer.countDocuments(filter);

    return { answers, total };
  },

  async findById(_id: string) {
    return Answer.findById(_id, { __v: 0 })
      .populate({
        path: "user_id",
        select: "username",
        model: "User",
      })
      .populate({
        path: "quizz_id",
        select: "title imageLink",
        model: "Quizz",
      });
  },
};
