import * as userService from '../services/user';
import { Request, Response, NextFunction } from 'express';
import { utapi, fileUploader } from '../utils/uploadthing';
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
    const avatarFile = req.files?.avatar;

    if (!avatarFile) {
      next(new CustomError('No file uploaded.', 400, 'NO_FILE_UPLOADED'));
      return;
    }

    const fileArray = Array.isArray(avatarFile) ? avatarFile : [avatarFile];
    const fileExtension = fileArray[0].mimetype.split('/')[1];

    const userForAvatarKey = await userService.getMe(req.user?.id ?? '');
    if (userForAvatarKey) {
      await utapi.deleteFiles(`${userForAvatarKey.avatarKey}`);
    } else {
      next(new CustomError('User not found.', 404, 'USER_NOT_FOUND'));
      return;
    }

    const { url, key } = await fileUploader(
      [fileArray[0].data],
      `${req.user?.id}.${fileExtension[1]}`,
      {
        type: fileArray[0].mimetype,
      },
    );

    await userService.updateAvatar(req.user?.id ?? '', url, key);

    res.status(200).json({ url });
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
