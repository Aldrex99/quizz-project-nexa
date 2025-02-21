import * as userService from '../services/user';
import { Request, Response, NextFunction } from 'express';
import { utapi } from '../utils/uploadthing';
import { CustomError } from '../utils/customError';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getMe(req.user?.id ?? '');
    res.status(200).json(user);
  } catch (error) {
    next(new CustomError('An error occurred while fetching the user.', 500, 'GET_ME_ERROR'));
  }
};

export const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files;

    if (!files) {
      next(new CustomError('No file uploaded.', 400, 'NO_FILE_UPLOADED'));
      return;
    }

    res.status(200).json({});
  } catch (error) {
    next(
      new CustomError('An error occurred while updating the avatar.', 500, 'UPDATE_AVATAR_ERROR'),
    );
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email } = req.body;

    const user = await userService.updateProfile(req.user?.id ?? '', {
      username,
      email,
    });

    res.status(200).json(user);
  } catch (error) {
    next(
      new CustomError('An error occurred while updating the profile.', 500, 'UPDATE_PROFILE_ERROR'),
    );
  }
};
