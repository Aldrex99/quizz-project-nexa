import { body, param } from 'express-validator';

const passwordValidator = body('password')
  .isString()
  .withMessage('doit être une chaîne de caractères.')
  .isLength({ min: 8 })
  .withMessage('doit contenir au moins 8 caractères.')
  .matches(/\d/)
  .withMessage('doit contenir au moins 1 chiffre.')
  .matches(/[a-z]/)
  .withMessage('doit contenir au moins 1 lettre minuscule.')
  .matches(/[A-Z]/)
  .withMessage('doit contenir au moins 1 lettre majuscule.')
  .matches(/[!@#$%^&*\-\+]/)
  .withMessage('doit contenir au moins 1 caractère spécial.')
  .not()
  .matches(/^$|\s/)
  .withMessage("ne doit pas contenir d'espace.");

export const register = [
  body('email')
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    })
    .withMessage('Adresse email invalide.'),
  body('username')
    .isString()
    .withMessage("Le nom d'utilisateur doit être une chaîne de caractères."),
  passwordValidator,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les deux mots de passe ne correspondent pas.');
    }
    return true;
  }),
];

export const login = [
  body('email')
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    })
    .withMessage('Adresse email invalide.'),
];

export const forgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    })
    .withMessage('Adresse email invalide.'),
];

export const resetPassword = [
  param('token').isString().withMessage('Token invalide.'),
  passwordValidator,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Les deux mots de passe ne correspondent pas.');
    }
    return true;
  }),
];
