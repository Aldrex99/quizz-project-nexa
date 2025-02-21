import * as categoryService from '../services/category';
import { CustomError } from '../utils/customError';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { validationErrorsUtil } from '../utils/validatorError';

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { name } = req.body;

    await categoryService.createCategory({ name });
    res.status(201).json({ message: 'Category created' });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'CREATE_CATEGORY_ERROR'));
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { page, limit, sortBy, sortOrder, search } = req.query;

    const categories = await categoryService.getCategories(
      { name: { $regex: search || '', $options: 'i' } },
      parseInt(limit as string, 10) || 10,
      parseInt(page as string, 10) || 1,
      sortBy as string,
      sortOrder as 'asc' | 'desc',
    );

    res.status(200).json(categories);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_CATEGORIES_ERROR'));
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;

    const category = await categoryService.getCategoryById(id);

    res.status(200).json(category);
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'GET_CATEGORY_ERROR'));
  }
};

export const deleteCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    await validationErrorsUtil(errors, res);
    return;
  }

  try {
    const { id } = req.params;

    await categoryService.deleteCategoryById(id);

    res.status(204).json();
  } catch (error) {
    next(new CustomError((error as Error).message, 500, 'DELETE_CATEGORY_ERROR'));
  }
};
