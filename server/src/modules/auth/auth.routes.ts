import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../common/middlewares/validate.middleware';
import { authenticate } from '../../common/middlewares/auth.middleware';
import { 
  RegisterDtoSchema, 
  LoginDtoSchema, 
  RefreshTokenDtoSchema 
} from './auth.dto';

const router = Router();

router.post(
  '/register',
  validateRequest(RegisterDtoSchema),
  authController.register
);

router.post(
  '/login',
  validateRequest(LoginDtoSchema),
  authController.login
);

router.post(
  '/refresh',
  validateRequest(RefreshTokenDtoSchema),
  authController.refresh
);

router.post(
  '/logout',
  authenticate,
  authController.logout
);

router.get(
  '/me',
  authenticate,
  authController.getMe
);

export const authRoutes = router;
