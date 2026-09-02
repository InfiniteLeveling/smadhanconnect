import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      return ApiResponse.created(res, result, 'User registered successfully');
    } catch (error) {
      return next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      return ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refresh(refreshToken);
      return ApiResponse.success(res, tokens, 'Token refreshed successfully');
    } catch (error) {
      return next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      return next(error);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      return ApiResponse.success(res, user, 'Authenticated user profile retrieved');
    } catch (error) {
      return next(error);
    }
  }
}

export const authController = new AuthController();
