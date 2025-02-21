import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: parseInt(process.env.ACCESS_TOKEN_LIFETIME!),
  });
};

export const generateRefreshToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: parseInt(process.env.REFRESH_TOKEN_LIFETIME!),
  });
};

export const generateResetPasswordToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.RESET_PASSWORD_TOKEN_SECRET!, {
    expiresIn: parseInt(process.env.RESET_PASSWORD_TOKEN_LIFETIME!),
  });
};

export const verifyAccessToken = async (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};

export const verifyRefreshToken = async (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
};

export const verifyResetPasswordToken = async (token: string) => {
  return jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET!);
};

export const decodeToken = async (token: string) => {
  return jwt.decode(token);
};
