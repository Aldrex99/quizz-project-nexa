import { Router } from 'express';
import { uploadAvatar } from '../middlewares/file';
import * as userController from '../controllers/user';

const router = Router();

router.get('/me', userController.getMe);
router.post('/avatar', uploadAvatar, userController.updateAvatar);
router.put('/me', userController.updateProfile);

export default router;
