import * as quizzService from '../services/quizz';
import * as answerService from '../services/answer';
import { CustomError } from '../utils/customError';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validationErrorsUtil } from '../utils/validatorError';

export const answerQuizz = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { quizz_id } = req.params;
    const { answers } = req.body;
    const user_id = req.user?.id ?? '';

    const quizz = await quizzService.getQuizzCorrectAnswers(quizz_id);

    if (!quizz) {
      throw new CustomError('Quizz not found', 404, 'QUIZZ_NOT_FOUND');
    }

    const { score, totalScore, updatedAnswers } = await answerService.verifyAnswers(
      answers,
      quizz.questions,
    );

    const data = {
      user_id,
      quizz_id,
      answers: updatedAnswers,
      score,
      totalScore,
    };

    const answer = await answerService.createAnswer(data);

    res.status(201).json(answer);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'ANSWER_QUIZZ_ERROR'));
  }
};

export const getAnswerById = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;

    const answer = await answerService.getAnswerById(id);

    if (!answer) {
      throw new CustomError('Answer not found', 404, 'ANSWER_NOT_FOUND');
    }

    res.status(200).json(answer);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_ANSWER_BY_ID_ERROR'));
  }
};

export const getFilteredAndPaginatedAnswersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;

    const answers = await answerService.getAnswers(
      { user_id },
      Number(limit) || 10,
      Number(page) || 1,
      sortBy as string,
      sortOrder as 'asc' | 'desc',
    );

    res.status(200).json(answers);
  } catch (error) {
    next(
      new CustomError(
        (error as Error).message,
        500,
        'GET_FILTERED_AND_PAGINATED_ANSWERS_BY_USER_ID_ERROR',
      ),
    );
  }
};

export const getFilteredAndPaginatedAnswersByQuizzId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { quizz_id } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;

    const answers = await answerService.getAnswers(
      { quizz_id },
      Number(limit) || 10,
      Number(page) || 1,
      sortBy as string,
      sortOrder as 'asc' | 'desc',
    );

    res.status(200).json(answers);
  } catch (error) {
    next(
      new CustomError(
        (error as Error).message,
        500,
        'GET_FILTERED_AND_PAGINATED_ANSWERS_BY_QUIZZ_ID_ERROR',
      ),
    );
  }
};
