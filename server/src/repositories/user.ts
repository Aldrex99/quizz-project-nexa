import User, { IUserDocument } from "@/models/user";

export const UserRepository = {
  async create(data: Partial<IUserDocument>) {
    try {
      const user = new User(data);
      await user.save();
      return;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new Error("Email or username is already used");
      }

      throw error;
    }
  },

  async findOneByEmail(email: string) {
    return User.findOne({ email });
  },

  async findOneByUsername(username: string) {
    return User.findOne({ username });
  },

  async findById(id: string) {
    return User.findById(id);
  },
};
