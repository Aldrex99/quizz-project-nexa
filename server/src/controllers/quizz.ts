import * as quizzService from '../services/quizz';
import { CustomError } from '../utils/customError';
import { fileUploader, utapi } from '../utils/uploadthing';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validationErrorsUtil } from '../utils/validatorError';

export const createQuizz = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { title, description, categories, questions } = req.body;

    const newQuizz = await quizzService.createQuizz({
      title,
      description,
      category_ids: categories,
      questions,
      author_id: req.user?.id as string,
    });

    const quizzFile = req.files?.quizzImage;
    if (!quizzFile) {
      next(new CustomError('No file uploaded.', 400, 'NO_FILE_UPLOADED'));
      return;
    }
    const fileArray = Array.isArray(quizzFile) ? quizzFile : [quizzFile];
    const customName = fileArray[0].name.split('.');
    fileArray[0].name = `${req.user?.id}.${customName[1]}`;

    const quizzForImageKey = await quizzService.getQuizzById(newQuizz._id as string);
    if (quizzForImageKey) {
      await utapi.deleteFiles(`${quizzForImageKey.imageKey}`);
    } else {
      next(new CustomError('User not found.', 404, 'USER_NOT_FOUND'));
      return;
    }

    const { url, key } = await fileUploader(
      [fileArray[0].data],
      `${req.user?.id}.${customName[1]}`,
      {
        type: fileArray[0].mimetype,
      },
    );

    await quizzService.updateQuizzById(newQuizz._id as string, req.user?.id ?? '', {
      imageLink: url,
      imageKey: key,
    });

    res.status(201).json({ message: 'Quizz created' });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'CREATE_QUIZZ_ERROR'));
  }
};

export const getQuizzes = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { page, limit, sortBy, sortOrder, search } = req.query;

    const quizzes = await quizzService.getQuizzes(
      { title: { $regex: search || '', $options: 'i' } },
      parseInt(limit as string, 10) || 10,
      parseInt(page as string, 10) || 1,
      sortBy as string,
      sortOrder as 'asc' | 'desc',
    );

    res.status(200).json(quizzes);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_QUIZZES_ERROR'));
  }
};

export const getQuizzForUserAnswer = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;

    const quizz = await quizzService.getQuizzById(id);

    // Remove the correct answer from the questions
    quizz?.questions.forEach((question) => {
      question.correctAnswer = [];
    });

    res.status(200).json(quizz);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_QUIZZ_ERROR'));
  }
};

export const getQuizzById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const quizz = await quizzService.getQuizzById(id);

    res.status(200).json(quizz);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_QUIZZ_ERROR'));
  }
};

export const getQuizziesByAuthorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const quizzes = await quizzService.getQuizziesByAuthorId(id);

    res.status(200).json(quizzes);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_QUIZZIES_BY_AUTHOR_ID'));
  }
};

export const updateQuizzById = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;
    const { title, description, categories, questions } = req.body;
    const quizzFile = req.files?.quizzImage;

    const parsedCategories = JSON.parse(categories);
    const parsedQuestions = JSON.parse(questions);

    if (quizzFile) {
      const fileArray = Array.isArray(quizzFile) ? quizzFile : [quizzFile];
      const fileExtension = fileArray[0].mimetype.split('/')[1];

      const quizzForImageKey = await quizzService.getQuizzById(id);
      if (quizzForImageKey) {
        await utapi.deleteFiles(`${quizzForImageKey.imageKey}`);
      } else {
        next(new CustomError('User not found.', 404, 'USER_NOT_FOUND'));
        return;
      }

      const { url, key } = await fileUploader([fileArray[0].data], `${id}.${fileExtension[1]}`, {
        type: fileArray[0].mimetype,
      });

      await quizzService.updateQuizzById(id, req.user?.id ?? '', {
        title,
        description,
        category_ids: parsedCategories,
        questions: parsedQuestions,
        imageLink: url,
        imageKey: key,
      });
    } else {
      await quizzService.updateQuizzById(id, req.user?.id ?? '', {
        title,
        description,
        category_ids: parsedCategories,
        questions: parsedQuestions,
      });
    }

    res.status(200).json({ message: 'Quizz updated' });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'UPDATE_QUIZZ_ERROR'));
  }
};

export const deleteQuizzById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await quizzService.deleteQuizzById(id, req.user?.id ?? '');

    res.status(200).json({ message: 'Quizz deleted' });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'DELETE_QUIZZ_ERROR'));
  }
};
