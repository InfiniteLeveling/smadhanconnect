import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error';
import { ApiResponse } from '../utils/api-response';
import { ZodError } from 'zod';
import { Logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  Logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message}`, err.stack);

  // Handle known AppError instances
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.errorCode,
      err.details
    );
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return ApiResponse.error(
      res,
      'Validation Failed',
      400,
      'VALIDATION_ERROR',
      formattedErrors
    );
  }

  // Fallback for unhandled unexpected errors
  const isDev = process.env.NODE_ENV === 'development';
  return ApiResponse.error(
    res,
    isDev ? err.message : 'Internal Server Error',
    500,
    'INTERNAL_SERVER_ERROR',
    isDev ? err.stack : undefined
  );
};
