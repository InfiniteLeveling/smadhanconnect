import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.config';
import { UnauthorizedError, ForbiddenError } from '../errors/app.error';
import { ErrorCode } from '../errors/error-codes';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('No authentication token provided', ErrorCode.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthenticatedUser;
    req.user = decoded;
    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Authentication token has expired', ErrorCode.TOKEN_EXPIRED));
    }
    return next(new UnauthorizedError('Invalid authentication token', ErrorCode.INVALID_TOKEN));
  }
};

export const requireRole = (allowedRoles: Role[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Forbidden: Role '${req.user.role}' does not have access to this resource. Allowed roles: [${allowedRoles.join(', ')}]`
        )
      );
    }

    return next();
  };
};
