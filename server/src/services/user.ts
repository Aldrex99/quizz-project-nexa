import { CustomError } from "../utils/customError";
import { IUser } from "../models/user";
import { UserRepository } from "../repositories/user";

export const getMe = async (id: string) => {
  try {
    const user = await UserRepository.findById(id);

    if (user && !user.avatarLink) {
      user.avatarLink = `${process.env.FILE_LINK}/default-avatar.webp`;
    }

    return user;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new CustomError(
        "L'adresse email ou le nom d'utilisateur est déjà utilisé",
        409
      );
    }

    throw error;
  }
};
