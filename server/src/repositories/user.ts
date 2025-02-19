import User, { IUserDocument } from "../models/user";
import { CustomError } from "../utils/customError";

export const UserRepository = {
  async create(data: Partial<IUserDocument>) {
    try {
      const user = new User(data);
      await user.save();
      return;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new CustomError(
          "L'adresse email ou le nom d'utilisateur est déjà utilisé",
          409
        );
      }

      throw error;
    }
  },

  async findOneForLogin(email: string) {
    return User.findOne({ email });
  },

  async findOneByUsername(username: string) {
    return User.findOne(
      { username },
      { __v: 0, password: 0, resetPasswordToken: 0 }
    );
  },

  async findById(_id: string) {
    return User.findById(_id, { __v: 0, password: 0, resetPasswordToken: 0 });
  },

  async updateAvatar(_id: string, avatarLink: string) {
    return User.findByIdAndUpdate(_id, { avatarLink });
  },
};
