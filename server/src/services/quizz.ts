import { IQuizzDocument, IQuizz } from "../models/quizz";
import { QuizzRepository } from "../repositories/quizz";

const quizzFormatter = (quizz: IQuizzDocument): IQuizz => {
  const quizzObject = quizz.toObject();

  const formattedQuizz = {
    ...quizzObject,
    author: quizzObject.author_id,
    categories: quizzObject.category_ids,
  };

  return {
    ...formattedQuizz,
    author_id: quizzObject.author?._id,
    category_ids: quizzObject.categories?.map(
      (category: { _id: string; name: string }) => category._id
    ),
  };
};

const quizzesFormatter = (quizzes: IQuizzDocument[]) => {
  return quizzes.map((quizz) => {
    return quizzFormatter(quizz);
  });
};

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

  return {
    quizzes: quizzesFormatter(quizzes.quizzes),
    total: quizzes.total,
  };
};

export const getQuizzById = async (id: string) => {
  const quizz = await QuizzRepository.findById(id);
  return quizz ? quizzFormatter(quizz) : null;
};

export const getQuizziesByAuthorId = async (authorId: string) => {
  const quizzies = await QuizzRepository.findByAuthorId(authorId);
  return quizzesFormatter(quizzies);
};

export const updateQuizzById = async (
  id: string,
  userId: string,
  data: Partial<IQuizz>
) => {
  console.log("On passe le service");
  const quizzToUpdate = await QuizzRepository.updateById(id, userId, data);
  console.log("quizzToUpdate", quizzToUpdate);
  return;
};

export const deleteQuizzById = async (id: string, userId: string) => {
  return await QuizzRepository.deleteById(id, userId);
};
