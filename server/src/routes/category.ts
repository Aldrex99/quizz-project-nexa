import { Router } from 'express';
import { checkRole } from '../middlewares/role';
import * as categoryValidator from '../validators/category';
import * as categoryController from '../controllers/category';

const router = Router();

router.post(
  '/create',
  checkRole(['moderator', 'admin']),
  categoryValidator.create,
  categoryController.createCategory,
);
router.get('/all', categoryValidator.getCategories, categoryController.getCategories);
router.get('/:id', categoryValidator.getById, categoryController.getCategoryById);
router.delete(
  '/:id',
  checkRole(['moderator', 'admin']),
  categoryValidator.deleteById,
  categoryController.deleteCategoryById,
);

export default router;
