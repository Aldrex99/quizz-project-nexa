import { body, query, param } from 'express-validator';

export const answer = [
  param('quizz_id').isMongoId().withMessage('ID de quizz invalide.'),
  body('answers').isArray({ min: 1 }).withMessage('Le quizz doit avoir au moins une réponse.'),
  body('answers.*.question_id').isMongoId().withMessage('ID de question invalide.'),
  body('answers.*.answer')
    .isArray({ min: 1, max: 6 })
    .withMessage('La réponse doit être un tableau de 1 à 6 éléments.')
    .isIn(['A', 'B', 'C', 'D', 'E', 'F'])
    .withMessage(
      'La réponse doit être une chaîne de caractères de 1 caractère parmi A, B, C, D, E, F.',
    ),
];

export const getAnswersByUserId = [
  param('user_id').isMongoId().withMessage("ID d'utilisateur invalide."),
  query('page').isNumeric().withMessage('La page doit être un nombre.'),
  query('limit').isNumeric().withMessage('La limite doit être un nombre.'),
  query('sortBy').isString().optional(),
  query('sortOrder').isString().optional().isIn(['asc', 'desc']),
];

export const getAnswersByQuizzId = [
  param('quizz_id').isMongoId().withMessage('ID de quizz invalide.'),
  query('page').isNumeric().withMessage('La page doit être un nombre.'),
  query('limit').isNumeric().withMessage('La limite doit être un nombre.'),
  query('sortBy').isString().optional(),
  query('sortOrder').isString().optional().isIn(['asc', 'desc']),
];

export const getAnswerById = [param('id').isMongoId().withMessage('ID de réponse invalide')];
