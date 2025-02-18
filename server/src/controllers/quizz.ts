import * as quizzService from "../services/quizz";
import { CustomError } from "../utils/customError";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validatorError";

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
    const { title, description, categories, questions } = req.body;

    await quizzService.createQuizz({
      title,
      description,
      categories,
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
