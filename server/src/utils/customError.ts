export class CustomError extends Error {
  public status: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;
  constructor(
    message: string,
    status: number = 500,
    code: string = 'UNKNOWN_ERROR',
    isOperational: boolean = true,
    details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
