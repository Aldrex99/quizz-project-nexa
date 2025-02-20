import { body, query, param } from "express-validator";

export const create = [
  body("title")
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Le titre doit être une chaîne de caractères entre 3 et 50 caractères."
    ),
  body("description")
    .isString()
    .isLength({ min: 3, max: 250 })
    .withMessage(
      "La description doit être une chaîne de caractères entre 3 et 250 caractères."
    ),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("Le quizz doit avoir au moins une catégorie."),
  body("categories.*").isMongoId().withMessage("ID de catégorie invalide."),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Le quizz doit avoir au moins une question."),
  body("questions.*.text")
    .isString()
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Le texte de la question doit être une chaîne de caractères entre 3 et 200 caractères."
    ),
  body("questions.*.options")
    .isArray({ min: 2, max: 6 })
    .withMessage("La question doit avoir entre 2 et 6 options."),
  body("questions.*.options.*.key")
    .isString()
    .isLength({ min: 1, max: 1 })
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage(
      "La clé de l'option doit être une chaîne de caractères de 1 caractère parmi A, B, C, D, E, F."
    ),
  body("questions.*.options.*.value")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "La valeur de l'option doit être une chaîne de caractères entre 1 et 100 caractères."
    ),
  body("questions.*.isMultipleChoice")
    .isBoolean()
    .withMessage("isMultipleChoice doit être un booléen."),
  body("questions.*.correctAnswer")
    .isArray({ min: 1 })
    .withMessage("La question doit avoir au moins une réponse correcte."),
  body("questions.*.correctAnswer.*")
    .isString()
    .isLength({ min: 1, max: 1 })
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage(
      "La réponse correcte doit être une chaîne de caractères de 1 caractère parmi A, B, C, D, E, F."
    ),
  body("questions.*.points")
    .isNumeric()
    .withMessage("Les points doivent être un nombre."),
];

export const getQuizzes = [
  query("page").optional().isNumeric(),
  query("limit").optional().isNumeric(),
  query("sortBy").optional().isString(),
  query("sortOrder").optional().isString().isIn(["asc", "desc"]),
  query("search").optional().isString(),
];

export const getQuizzById = [param("id").isMongoId()];

export const getQuizziesByAuthorId = [param("authorId").isMongoId()];

export const updateQuizzById = [
  param("id").isMongoId().withMessage("ID invalide."),
  body("title")
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "Le titre doit être une chaîne de caractères entre 3 et 50 caractères."
    ),
  body("description")
    .isString()
    .isLength({ min: 3, max: 250 })
    .withMessage(
      "La description doit être une chaîne de caractères entre 3 et 250 caractères."
    ),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("Le quizz doit avoir au moins une catégorie."),
  body("categories.*").isMongoId().withMessage("ID de catégorie invalide."),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Le quizz doit avoir au moins une question."),
  body("questions.*.id")
    .optional()
    .isUUID()
    .withMessage("ID de question invalide."),
  body("questions.*.text")
    .isString()
    .isLength({ min: 3, max: 200 })
    .withMessage(
      "Le texte de la question doit être une chaîne de caractères entre 3 et 200 caractères."
    ),
  body("questions.*.options")
    .isArray({ min: 2, max: 6 })
    .withMessage("La question doit avoir entre 2 et 6 options."),
  body("questions.*.options.*.key")
    .isString()
    .isLength({ min: 1, max: 1 })
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage(
      "La clé de l'option doit être une chaîne de caractères de 1 caractère parmi A, B, C, D, E, F."
    ),
  body("questions.*.options.*.value")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      "La valeur de l'option doit être une chaîne de caractères entre 1 et 100 caractères."
    ),
  body("questions.*.isMultipleChoice")
    .isBoolean()
    .withMessage("isMultipleChoice doit être un booléen."),
  body("questions.*.correctAnswer")
    .isArray({ min: 1 })
    .withMessage("La question doit avoir au moins une réponse correcte."),
  body("questions.*.correctAnswer.*")
    .isString()
    .isLength({ min: 1, max: 1 })
    .isIn(["A", "B", "C", "D", "E", "F"])
    .withMessage(
      "La réponse correcte doit être une chaîne de caractères de 1 caractère parmi A, B, C, D, E, F."
    ),
  body("questions.*.points")
    .isNumeric()
    .withMessage("Les points doivent être un nombre."),
];

export const deleteQuizzById = [param("id").isMongoId()];
