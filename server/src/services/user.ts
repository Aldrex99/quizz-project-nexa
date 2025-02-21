import { CustomError } from '../utils/customError';
import { IUser } from '../models/user';
import { UserRepository } from '../repositories/user';

export const getMe = async (id: string) => {
  try {
    const user = await UserRepository.findById(id);

    if (user && !user.avatarLink) {
      user.avatarLink = `${process.env.DEFAULT_AVATAR_LINK}`;
    }

    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new CustomError("L'adresse email ou le nom d'utilisateur est déjà utilisé", 409);
    }

    throw error;
  }
};

export const updateAvatar = async (id: string, avatarLink: string, avatarKey: string) => {
  try {
    await UserRepository.updateAvatar(id, avatarLink, avatarKey);
  } catch (error: any) {
    throw error;
  }
};

export const updateProfile = async (id: string, data: Partial<IUser>) => {
  try {
    return await UserRepository.updateProfile(id, data);
  } catch (error: any) {
    throw error;
  }
};
