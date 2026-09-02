import { ErrorCode } from './error-codes';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: ErrorCode;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode = 500,
    errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, ErrorCode.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized Access', errorCode = ErrorCode.UNAUTHORIZED) {
    super(message, 401, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access Forbidden: Insufficient Permissions') {
    super(message, 403, ErrorCode.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found', errorCode = ErrorCode.NOT_FOUND) {
    super(message, 404, errorCode);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource Conflict', errorCode = ErrorCode.CONFLICT) {
    super(message, 409, errorCode);
  }
}
