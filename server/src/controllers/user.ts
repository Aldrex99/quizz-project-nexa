import * as userService from "../services/user";
import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/customError";

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getMe(req.user?.id ?? "");
    res.status(200).json(user);
  } catch (error) {
    next(
      new CustomError(
        "An error occurred while fetching the user.",
        500,
        "GET_ME_ERROR"
      )
    );
  }
};
