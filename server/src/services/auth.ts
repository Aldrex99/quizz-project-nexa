import { CustomError } from '../utils/customError';
import { generateResetPasswordToken, verifyResetPasswordToken } from '../utils/token';
import { IUser } from '../models/user';
import { UserRepository } from '../repositories/user';
import { checkPassword, hashPassword } from '../utils/password';

export const register = async (data: Partial<IUser>) => {
  try {
    const hashedPassword = await hashPassword(data.password as string);
    data.password = hashedPassword;

    await UserRepository.create(data);
    return;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new CustomError("L'adresse email ou le nom d'utilisateur est déjà utilisé", 409);
    }

    throw error;
  }
};

export const login = async (email: string, password: string) => {
  try {
    const user = await UserRepository.findOneForLogin(email);
    if (!user) {
      throw new CustomError("L'email ou le mot de passe est incorrect", 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await checkPassword(password, user.password as string);
    if (!isMatch) {
      throw new CustomError("L'email ou le mot de passe est incorrect", 401, 'INVALID_CREDENTIALS');
    }

    user.password = undefined;
    user.resetPasswordToken = undefined;

    return user;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const user = await UserRepository.findOneForLogin(email);
    if (!user) {
      throw new CustomError(
        'Aucun utilisateur trouvé avec cette adresse email',
        404,
        'USER_NOT_FOUND',
      );
    }

    const resetToken = generateResetPasswordToken(user.id);

    await UserRepository.updateResetPasswordToken(user.email, resetToken);

    return resetToken;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const rawToken = verifyResetPasswordToken(token);
    if (!rawToken) {
      throw new CustomError('Token invalide', 400, 'INVALID_TOKEN');
    }

    const hashedPassword = await hashPassword(password);
    await UserRepository.updatePasswordWithToken(token, hashedPassword);

    return;
  } catch (error) {
    throw error;
  }
};
