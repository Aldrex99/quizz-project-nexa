import { Router } from 'express';
import * as userController from '../controllers/user';

const router = Router();

router.get('/me', userController.getMe);
router.post('/avatar', userController.updateAvatar);
router.put('/me', userController.updateProfile);

export default router;
