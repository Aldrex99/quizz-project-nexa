import * as authService from "../services/auth";
import { CustomError } from "../utils/customError";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorsUtil } from "../utils/validatorError";
import { sendEmail } from "../utils/mail";

export const register = async (
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
    const { email, username, password } = req.body;

    await authService.register({ email, username, password });
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    if ((error as CustomError).status === 409) {
      next(
        new CustomError(
          (error as CustomError).message,
          409,
          "DUPLICATE_USER_KEY"
        )
      );
      return;
    }

    next(new CustomError((error as Error).message, 500, "REGISTER_ERROR"));
  }
};

export const login = async (
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
    const { email, password } = req.body;

    const user = await authService.login(email, password);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    res.status(200).json(user);
  } catch (error) {
    if ((error as CustomError).status === 401) {
      next(
        new CustomError(
          (error as CustomError).message,
          401,
          "INVALID_CREDENTIALS"
        )
      );
      return;
    }
    next(new CustomError((error as Error).message, 500, "LOGIN_ERROR"));
  }
};

export const newAccessTokenFromRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const accessToken = generateAccessToken(req.user?.id, req.user?.role);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200);
    res.end();
  } catch (error) {
    next(
      new CustomError((error as Error).message, 500, "NEW_ACCESS_TOKEN_ERROR")
    );
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out" });
  } catch (error) {
    next(new CustomError((error as Error).message, 500, "LOGOUT_ERROR"));
  }
};

export const forgotPassword = async (
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
    const { email } = req.body;

    const resetToken = await authService.forgotPassword(email);

    await sendEmail(
      email,
      "Réinitialisation du mot de passe | Quizz Universe",
      "Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n" +
        "Veuillez cliquer sur le lien suivant, ou collez-le dans votre navigateur pour terminer le processus:\n\n" +
        `${process.env.CLIENT_URL}/reset-password/${resetToken}\n\n` +
        "Si vous n'avez pas demandé cela, veuillez ignorer cet email et votre mot de passe restera inchangé.",
      `<p>Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.</p>
      <p>Veuillez cliquer sur le lien suivant, ou collez-le dans votre navigateur pour terminer le processus:</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Réinitialiser le mot de passe</a>
      <p>Si vous n'avez pas demandé cela, veuillez ignorer cet email et votre mot de passe restera inchangé.</p>`
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    next(
      new CustomError((error as Error).message, 500, "FORGOT_PASSWORD_ERROR")
    );
  }
};

export const resetPassword = async (
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
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    res.status(200).json({ message: "Password reset" });
  } catch (error) {
    next(
      new CustomError((error as Error).message, 500, "RESET_PASSWORD_ERROR")
    );
  }
};
