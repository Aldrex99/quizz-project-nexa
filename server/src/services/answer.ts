import { IQuizz } from 'src/models/quizz';
import { IAnswerDocument, IAnswer } from '../models/answer';
import { AnswerRepository } from '../repositories/answer';

export const answerFormatter = (answer: IAnswerDocument): IAnswer => {
  const answerObject = answer.toObject();

  return {
    ...answerObject,
    user: answerObject.user_id,
    quizz: answerObject.quizz_id,
    user_id: answerObject.user_id._id,
    quizz_id: answerObject.quizz_id._id,
  };
};

export const answersFormatter = (answers: IAnswerDocument[]) => {
  return answers.map((answer) => {
    return answerFormatter(answer);
  });
};

export const verifyAnswers = async (
  answers: IAnswer['answers'],
  questions: IQuizz['questions'],
) => {
  let totalScore = 0;
  let score = 0;

  answers.map((answer) => {
    const question = questions.find((q) => q._id?.toString() === answer.question_id);

    if (!question) {
      throw new Error('Question not found');
    }

    totalScore += question.points;
    const correctAnswer = question.correctAnswer;

    const isCorrect = correctAnswer.every((ans) => answer.answer.includes(ans));

    if (isCorrect) {
      score += question.points;
    }

    answer.isCorrect = isCorrect;
    answer.correctAnswer = correctAnswer;
  });

  return { score, totalScore, updatedAnswers: answers };
};

export const createAnswer = async (data: Partial<IAnswer>) => {
  try {
    return answerFormatter(await AnswerRepository.create(data));
  } catch (error: any) {
    throw error;
  }
};

export const getAnswerById = async (_id: string) => {
  const answer = await AnswerRepository.findById(_id);
  return answer ? answerFormatter(answer) : null;
};

export const getAnswers = async (
  filter: Record<string, any>,
  limit: number,
  page: number,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
) => {
  const skip = limit * (page - 1);

  const answers = await AnswerRepository.getFilteredAndPaginatedAnswers(
    filter,
    skip,
    limit,
    sortBy,
    sortOrder,
  );

  return {
    answers: answersFormatter(answers.answers),
    total: answers.total,
  };
};
