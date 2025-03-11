import { Request, NextFunction, Response } from 'express';
import { verifyAccessToken, verifyRefreshToken } from '../utils/token';
import { CustomError } from '../utils/customError';

export const checkAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies['accessToken'];
  if (!accessToken) {
    next(
      new CustomError(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
        401,
        'UNDEFINED_ACCESS_TOKEN',
      ),
    );
    return;
  }

  try {
    const rawUser = await verifyAccessToken(accessToken);

    if (typeof rawUser === 'string') {
      next(new CustomError("Votre token n'est pas valide", 403, 'INVALID_ACCESS_TOKEN'));
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
      if ((err as Error).name === 'TokenExpiredError') {
        next(new CustomError('accessToken expiré', 432, 'ACCESS_TOKEN_EXPIRED'));
        return;
      }

      next(new CustomError("Votre token n'est pas valide", 403, 'INVALID_ACCESS_TOKEN'));
      return;
    }
  }
};

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    next(
      new CustomError(
        "Vous n'êtes pas autorisé à accéder à cette ressource",
        401,
        'UNDEFINED_REFRESH_TOKEN',
      ),
    );
    return;
  }

  try {
    const rawUser = await verifyRefreshToken(refreshToken);

    if (typeof rawUser === 'string') {
      next(new CustomError("Votre token n'est pas valide", 403, 'INVALID_REFRESH_TOKEN'));
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
      if ((err as Error).name === 'TokenExpiredError') {
        next(new CustomError('refreshToken expiré', 433, 'REFRESH_TOKEN_EXPIRED'));
        return;
      }

      next(new CustomError("Votre token n'est pas valide", 403, 'INVALID_REFRESH_TOKEN'));
      return;
    }
  }
};
