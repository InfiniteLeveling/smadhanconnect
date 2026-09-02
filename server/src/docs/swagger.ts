import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

export const setupSwagger = (app: Express) => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log('📖 Swagger API Documentation initialized at /api/docs');
};
