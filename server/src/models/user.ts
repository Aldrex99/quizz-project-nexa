import { Document, Model, model, Schema } from "mongoose";

export interface IUser {
  email: string;
  username: string;
  role: string;
  password?: string;
  resetPasswordToken?: string;
  profilePictureLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  resetPasswordToken: { type: String },
  profilePictureLink: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel: Model<IUserDocument> = model<IUserDocument>(
  "User",
  UserSchema
);

export default UserModel;
