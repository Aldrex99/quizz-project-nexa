import { IQuizz } from "../models/quizz";
import { QuizzRepository } from "../repositories/quizz";

export const createQuizz = async (data: Partial<IQuizz>) => {
  try {
    await QuizzRepository.create(data);
  } catch (error: any) {
    throw error;
  }
};

export const getQuizzes = async (
  filter: Record<string, any>,
  limit: number,
  page: number,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const skip = limit * (page - 1);

  const quizzes = await QuizzRepository.getFilteredAndPaginatedQuizzes(
    filter,
    skip,
    limit,
    sortBy,
    sortOrder
  );

  return quizzes;
};

export const getQuizzById = async (id: string) => {
  return QuizzRepository.findById(id);
};

export const getQuizziesByAuthorId = async (authorId: string) => {
  return QuizzRepository.findByAuthorId(authorId);
};

export const updateQuizzById = async (
  id: string,
  userId: string,
  data: Partial<IQuizz>
) => {
  return QuizzRepository.updateById(id, userId, data);
};

export const deleteQuizzById = async (id: string, userId: string) => {
  return QuizzRepository.deleteById(id, userId);
};
