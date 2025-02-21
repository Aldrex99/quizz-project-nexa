import { Router } from 'express';
import * as answerValidator from '../validators/answer';
import * as answerController from '../controllers/answer';

const router = Router();

router.post('/:quizz_id', answerValidator.answer, answerController.answerQuizz);
router.get('/:id', answerValidator.getAnswerById, answerController.getAnswerById);
router.get(
  '/by-user/:user_id',
  answerValidator.getAnswersByUserId,
  answerController.getFilteredAndPaginatedAnswersByUserId,
);
router.get(
  '/by-quizz/:quizz_id',
  answerValidator.getAnswersByQuizzId,
  answerController.getFilteredAndPaginatedAnswersByQuizzId,
);

export default router;
