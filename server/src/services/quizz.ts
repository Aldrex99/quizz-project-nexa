import { IQuizzDocument, IQuizz } from '../models/quizz';
import { QuizzRepository } from '../repositories/quizz';

const quizzFormatter = (quizz: IQuizzDocument): IQuizz => {
  const quizzObject = quizz.toObject();

  return {
    ...quizzObject,
    author: quizzObject.author_id,
    categories: quizzObject.category_ids,
    author_id: quizzObject.author_id._id,
    category_ids: quizzObject.category_ids.map((category: any) => category._id),
  };
};

const quizzesFormatter = (quizzes: IQuizzDocument[]) => {
  return quizzes.map((quizz) => {
    return quizzFormatter(quizz);
  });
};

export const createQuizz = async (data: Partial<IQuizz>) => {
  try {
    return await QuizzRepository.create(data);
  } catch (error: any) {
    throw error;
  }
};

export const getQuizzes = async (
  filter: Record<string, any>,
  limit: number,
  page: number,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
) => {
  const skip = limit * (page - 1);

  const quizzes = await QuizzRepository.getFilteredAndPaginatedQuizzes(
    filter,
    skip,
    limit,
    sortBy,
    sortOrder,
  );

  return {
    quizzes: quizzesFormatter(quizzes.quizzes),
    total: quizzes.total,
  };
};

export const getQuizzById = async (id: string) => {
  const quizz = await QuizzRepository.findById(id);
  return quizz ? quizzFormatter(quizz) : null;
};

export const getQuizzCorrectAnswers = async (id: string) => {
  return await QuizzRepository.findQuizzQuestionsByQuizzId(id);
};

export const getQuizziesByAuthorId = async (authorId: string) => {
  const quizzies = await QuizzRepository.findByAuthorId(authorId);
  return quizzesFormatter(quizzies);
};

export const updateQuizzById = async (id: string, userId: string, data: Partial<IQuizz>) => {
  return await QuizzRepository.updateQuizzById(id, userId, data);
};

export const deleteQuizzById = async (id: string, userId: string) => {
  return await QuizzRepository.deleteQuizzById(id, userId);
};
