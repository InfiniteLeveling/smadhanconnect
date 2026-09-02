import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { validateRequest } from '../../common/middlewares/validate.middleware';
import { UpdateProfileDtoSchema } from './users.dto';

const router = Router();

router.get('/profile', authenticate, usersController.getProfile);
router.put('/profile', authenticate, validateRequest(UpdateProfileDtoSchema), usersController.updateProfile);

export const usersRoutes = router;
