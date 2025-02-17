import { Request, NextFunction, Response } from "express";
import { verifyAccessToken, verifyRefreshToken } from "@utils/token";

export const checkAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies["accessToken"];
  if (!accessToken) {
    res.status(401).json({
      code: 401,
      message: "Vous n'êtes pas autorisé à accéder à cette ressource",
    });
    return;
  }

  try {
    const rawUser = await verifyAccessToken(accessToken);

    if (typeof rawUser === "string") {
      res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
      return;
    }

    req.user = {
      id: rawUser.userId,
      role: rawUser.role,
      iat: rawUser.iat ?? 0,
      exp: rawUser.exp ?? 0,
    };

    next();
  } catch (err) {
    if (err) {
      if ((err as Error).name === "TokenExpiredError") {
        res.status(403).json({
          code: 432,
          message: "accessToken expiré",
        });
        return;
      }

      res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
      return;
    }
  }
};

export const checkRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    res.status(401).json({
      code: 401,
      message: "Vous n'êtes pas autorisé à accéder à cette ressource",
    });
    return;
  }

  try {
    const rawUser = await verifyRefreshToken(refreshToken);

    if (typeof rawUser === "string") {
      res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
      return;
    }

    req.user = {
      id: rawUser.userId,
      role: rawUser.role,
      iat: rawUser.iat ?? 0,
      exp: rawUser.exp ?? 0,
    };

    next();
  } catch (err) {
    if (err) {
      if ((err as Error).name === "TokenExpiredError") {
        res.status(403).json({
          code: 433,
          message: "refreshToken expiré",
        });
        return;
      }

      res.status(403).json({
        code: 403,
        message: "Votre token n'est pas valide",
      });
      return;
    }
  }
};
