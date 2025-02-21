import { Router } from 'express';
import * as quizzValidator from '../validators/quizz';
import * as quizzController from '../controllers/quizz';

const router = Router();

router.post('/create', quizzValidator.create, quizzController.createQuizz);
router.post('/upload/:quizz_id', quizzController.uploadQuizzImage);
router.get('/all', quizzValidator.getQuizzes, quizzController.getQuizzes);
router.get('/for-user/:id', quizzValidator.getQuizzById, quizzController.getQuizzForUserAnswer);
router.get('/one/:id', quizzValidator.getQuizzById, quizzController.getQuizzById);
router.get(
  '/author/:id',
  quizzValidator.getQuizziesByAuthorId,
  quizzController.getQuizziesByAuthorId,
);
router.put('/update/:id', quizzValidator.updateQuizzById, quizzController.updateQuizzById);
router.delete('/delete/:id', quizzValidator.getQuizzById, quizzController.deleteQuizzById);

export default router;
