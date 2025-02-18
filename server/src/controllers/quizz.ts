import * as quizzService from "../services/quizz";
import { CustomError } from "../utils/customError";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validatorError";
import { randomUUID } from "crypto";

export const createQuizz = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { title, description, categories, questions, imageLink } = req.body;

    await quizzService.createQuizz({
      title,
      description,
      imageLink,
      categories: categories.map((category: string) => ({
        _id: category,
      })),
      questions,
      author: {
        _id: req.user?.id ?? "",
      },
    });
    res.status(201).json({ message: "Quizz created" });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "CREATE_QUIZZ_ERROR"));
  }
};

export const getQuizzes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { page, limit, sortBy, sortOrder, search } = req.query;

    const quizzes = await quizzService.getQuizzes(
      { title: { $regex: search || "", $options: "i" } },
      parseInt(limit as string, 10) || 10,
      parseInt(page as string, 10) || 1,
      sortBy as string,
      sortOrder as "asc" | "desc"
    );

    res.status(200).json(quizzes);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "GET_QUIZZES_ERROR"));
  }
};

export const getQuizzForUserAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;

    const quizz = await quizzService.getQuizzById(id);

    console.log(quizz);

    // Remove the correct answer from the questions
    quizz?.questions.forEach((question) => {
      question.correctAnswer = [];
    });

    res.status(200).json(quizz);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "GET_QUIZZ_ERROR"));
  }
};

export const getQuizzById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const quizz = await quizzService.getQuizzById(id);

    res.status(200).json(quizz);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "GET_QUIZZ_ERROR"));
  }
};

export const getQuizziesByAuthorId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const quizzes = await quizzService.getQuizziesByAuthorId(id);

    res.status(200).json(quizzes);
  } catch (error) {
    next(
      new CustomError(
        (error as Error).message,
        500,
        "GET_QUIZZIES_BY_AUTHOR_ID"
      )
    );
  }
};

export const updateQuizzById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;
    const { title, description, categories, questions } = req.body;

    await quizzService.updateQuizzById(id, req.user?.id ?? "", {
      title,
      description,
      categories: categories.map((category: string) => ({
        _id: category,
      })),
      questions,
    });

    res.status(200).json({ message: "Quizz updated" });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "UPDATE_QUIZZ_ERROR"));
  }
};

export const deleteQuizzById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await quizzService.deleteQuizzById(id, req.user?.id ?? "");

    res.status(200).json({ message: "Quizz deleted" });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "DELETE_QUIZZ_ERROR"));
  }
};
