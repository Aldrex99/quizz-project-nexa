import { UTApi } from 'uploadthing/server';
import { CustomError } from './customError';

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
export const fileUploader = async (
  fileData: BlobPart[],
  fileName: string,
  options?: FilePropertyBag,
) => {
  const file = new File(fileData, fileName, options);
  if (!file || !allowedMimeTypes.includes(file.type)) {
    throw new CustomError('Invalid file type.', 400, 'INVALID_FILE_TYPE');
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new CustomError('File size too large.', 400, 'FILE_SIZE_TOO_LARGE');
  }

  const dataResult = await utapi.uploadFiles([file]);

  if (dataResult[0].error) {
    throw new CustomError(
      'An error occurred while uploading the avatar.',
      500,
      'UPLOAD_AVATAR_ERROR',
    );
  }

  return {
    url: dataResult[0].data.ufsUrl,
    key: dataResult[0].data.key,
  };
};
