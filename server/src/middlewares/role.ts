import { Request, NextFunction, Response } from "express";
import { CustomError } from "../utils/customError";

export const checkRole = (acceptedRole: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      next(
        new CustomError(
          "Vous n'êtes pas autorisé à accéder à cette ressource",
          403,
          "ROLE_ERROR"
        )
      );
      return;
    }

    if (!acceptedRole.includes(userRole)) {
      next(
        new CustomError(
          "Vous n'êtes pas autorisé à accéder à cette ressource",
          403,
          "ROLE_ERROR"
        )
      );
      return;
    }

    next();
  };
};
