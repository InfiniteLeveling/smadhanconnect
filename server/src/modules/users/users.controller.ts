import { Response, NextFunction } from 'express';
import { usersService } from './users.service';
import { ApiResponse } from '../../common/utils/api-response';
import { AuthenticatedRequest } from '../../common/middlewares/auth.middleware';

export class UsersController {
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await usersService.getUserById(req.user!.id);
      return ApiResponse.success(res, user, 'Profile retrieved successfully');
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updatedUser = await usersService.updateProfile(req.user!.id, req.body);
      return ApiResponse.success(res, updatedUser, 'Profile updated successfully');
    } catch (error) {
      return next(error);
    }
  }
}

export const usersController = new UsersController();
