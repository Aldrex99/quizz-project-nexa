import { Result, ValidationError } from "express-validator";
import { Response } from "express";

export const validationErrorsUtil = async (
  errors: Result<ValidationError>,
  res: Response
) => {
  return res.status(422).json({
    code: "VALIDATION_ERROR",
    message: "Les données envoyées sont incorrectes",
    errors: errors.array(),
  });
};
