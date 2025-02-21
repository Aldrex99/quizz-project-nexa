import { body, query, param } from 'express-validator';
import { IQuizz } from 'src/models/quizz';

export const create = [
  body('title')
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le titre doit être une chaîne de caractères entre 3 et 50 caractères.'),
  body('description')
    .isString()
    .isLength({ min: 3, max: 250 })
    .withMessage('La description doit être une chaîne de caractères entre 3 et 250 caractères.'),
  body('categories').custom((value) => {
    const parsedValue = JSON.parse(value);
    // verify if it's an array of mongodbIs
    if (!Array.isArray(parsedValue)) {
      throw new Error('Les catégories doivent être un tableau de chaînes de caractères.');
    }
    if (parsedValue.length < 1) {
      throw new Error('Le quizz doit avoir au moins une catégorie.');
    }
    if (!parsedValue.every((id) => id.match(/^[0-9a-fA-F]{24}$/))) {
      throw new Error('ID de catégorie invalide.');
    }
    return true;
  }),
  body('questions').custom((value) => {
    const parsedValue: IQuizz['questions'] = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error('Les questions doivent être un tableau de questions.');
    }
    if (parsedValue.length < 1) {
      throw new Error('Le quizz doit avoir au moins une question.');
    }
    if (
      !parsedValue.every(
        (question) =>
          question.text && question.options && question.correctAnswer && question.points,
      )
    ) {
      throw new Error(
        'Chaque question doit avoir un texte, des options, une réponse correcte et des points.',
      );
    }
    if (
      !parsedValue.every((question) => question.options.length >= 2 && question.options.length <= 6)
    ) {
      throw new Error('Chaque question doit avoir entre 2 et 6 options.');
    }
    if (
      !parsedValue.every((question) =>
        question.options.every((option) => option.key && option.value),
      )
    ) {
      throw new Error('Chaque option doit avoir une clé et une valeur.');
    }
    if (!parsedValue.every((question) => question.correctAnswer.length >= 1)) {
      throw new Error('Chaque question doit avoir au moins une réponse correcte.');
    }
    if (
      !parsedValue.every((question) =>
        question.correctAnswer.every((answer) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(answer)),
      )
    ) {
      throw new Error('La réponse correcte doit être une clé parmi A, B, C, D, E, F.');
    }
    if (!parsedValue.every((question) => question.points)) {
      throw new Error('Chaque question doit avoir des points.');
    }
    return true;
  }),
];

export const getQuizzes = [
  query('page').optional().isNumeric(),
  query('limit').optional().isNumeric(),
  query('sortBy').optional().isString(),
  query('sortOrder').optional().isString().isIn(['asc', 'desc']),
  query('search').optional().isString(),
];

export const getQuizzById = [param('id').isMongoId()];

export const getQuizziesByAuthorId = [param('authorId').isMongoId()];

export const updateQuizzById = [
  param('id').isMongoId().withMessage('ID invalide.'),
  body('title')
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage('Le titre doit être une chaîne de caractères entre 3 et 50 caractères.'),
  body('description')
    .isString()
    .isLength({ min: 3, max: 250 })
    .withMessage('La description doit être une chaîne de caractères entre 3 et 250 caractères.'),
  body('categories').custom((value) => {
    const parsedValue = JSON.parse(value);
    // verify if it's an array of mongodbIs
    if (!Array.isArray(parsedValue)) {
      throw new Error('Les catégories doivent être un tableau de chaînes de caractères.');
    }
    if (parsedValue.length < 1) {
      throw new Error('Le quizz doit avoir au moins une catégorie.');
    }
    if (!parsedValue.every((id) => id.match(/^[0-9a-fA-F]{24}$/))) {
      throw new Error('ID de catégorie invalide.');
    }
    return true;
  }),
  body('questions').custom((value) => {
    const parsedValue: IQuizz['questions'] = JSON.parse(value);

    if (!Array.isArray(parsedValue)) {
      throw new Error('Les questions doivent être un tableau de questions.');
    }
    if (parsedValue.length < 1) {
      throw new Error('Le quizz doit avoir au moins une question.');
    }
    if (
      !parsedValue.every(
        (question) =>
          question.text && question.options && question.correctAnswer && question.points,
      )
    ) {
      throw new Error(
        'Chaque question doit avoir un texte, des options, une réponse correcte et des points.',
      );
    }
    if (
      !parsedValue.every((question) => question.options.length >= 2 && question.options.length <= 6)
    ) {
      throw new Error('Chaque question doit avoir entre 2 et 6 options.');
    }
    if (
      !parsedValue.every((question) =>
        question.options.every((option) => option.key && option.value),
      )
    ) {
      throw new Error('Chaque option doit avoir une clé et une valeur.');
    }
    if (!parsedValue.every((question) => question.correctAnswer.length >= 1)) {
      throw new Error('Chaque question doit avoir au moins une réponse correcte.');
    }
    if (
      !parsedValue.every((question) =>
        question.correctAnswer.every((answer) => ['A', 'B', 'C', 'D', 'E', 'F'].includes(answer)),
      )
    ) {
      throw new Error('La réponse correcte doit être une clé parmi A, B, C, D, E, F.');
    }
    if (!parsedValue.every((question) => question.points)) {
      throw new Error('Chaque question doit avoir des points.');
    }
    return true;
  }),
];

export const deleteQuizzById = [param('id').isMongoId()];
