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
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1 }),
  query("sortBy").optional().isString(),
  query("sortOrder").optional().isIn(["asc", "desc"]),
  query("search").optional().isString(),
];

export const getById = [param("id").isMongoId().withMessage("ID invalide.")];

export const deleteById = [param("id").isMongoId().withMessage("ID invalide.")];
