import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Operation successful',
    statusCode = 200,
    meta?: any
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
      data,
      ...(meta && { meta })
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(
    res: Response,
    data: T,
    message = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message = 'Internal Server Error',
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR',
    details?: any
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      error: {
        code,
        message,
        ...(details && { details })
      }
    };
    return res.status(statusCode).json(payload);
  }
}
