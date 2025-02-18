import { body, param, query } from "express-validator";

export const create = [
  body("name")
    .isString()
    .withMessage("Le nom de la catégorie doit être une chaîne de caractères.")
    .isLength({ min: 3, max: 25 })
    .withMessage(
      "Le nom de la catégorie doit contenir entre 3 et 50 caractères."
    ),
];

export const getCategories = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La page doit être un nombre entier supérieur à 0."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La limite doit être un nombre entier supérieur à 0."),
  query("sortBy")
    .optional()
    .isString()
    .withMessage("Le tri doit être une chaîne de caractères."),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("L'ordre de tri doit être 'asc' ou 'desc'."),
  query("search")
    .optional()
    .isString()
    .withMessage("La recherche doit être une chaîne de caractères."),
];

export const getById = [param("id").isMongoId().withMessage("ID invalide.")];

export const deleteById = [param("id").isMongoId().withMessage("ID invalide.")];
