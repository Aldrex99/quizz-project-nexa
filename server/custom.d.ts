declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      role: string;
      iat: number;
      exp: number;
    };
  }
}
