export interface ICustomError extends Error {
  errors?: string[];
  validationErrors?: {
    path: string;
    errors: string[];
  }[];
}

export interface IValidationErrorResponse {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}
