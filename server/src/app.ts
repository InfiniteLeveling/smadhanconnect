import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.config';
import { errorHandler } from './common/middlewares/error.middleware';
import { ApiResponse } from './common/utils/api-response';
import { setupSwagger } from './docs/swagger';
import { authRoutes } from './modules/auth/auth.routes';
import { usersRoutes } from './modules/users/users.routes';
import { NotFoundError } from './common/errors/app.error';

export const createApp = (): Express => {
  const app = express();

  // Security & Core Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Swagger Documentation
  setupSwagger(app);

  // Health Check Endpoint
  app.get(`${env.API_PREFIX}/health`, (req: Request, res: Response) => {
    return ApiResponse.success(
      res,
      {
        service: 'INVICTUS Platform Backend API',
        theme: 'SIH26043 - Farmer Problem Solving & Innovation Platform',
        team: 'INVICTUS',
        institution: 'NIST University, Berhampur, Odisha',
        status: 'ONLINE',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      },
      'Health check passed'
    );
  });

  // Mount API Modules
  app.use(`${env.API_PREFIX}/auth`, authRoutes);
  app.use(`${env.API_PREFIX}/users`, usersRoutes);

  // 404 Catch-All Handler
  app.use((req: Request, res: Response, next) => {
    next(new NotFoundError(`Route not found: ${req.method} ${req.originalUrl}`));
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
